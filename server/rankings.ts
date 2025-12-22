import { TRPCError } from "@trpc/server";
import { eq, desc, and, gte } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "./db";
import { rankingSnapshots, nodeBadges, RankingSnapshot } from "../drizzle/schema";
import { publicProcedure, router } from "./_core/trpc";

export const rankingsRouter = router({
  /**
   * Save a snapshot of current rankings
   */
  saveSnapshot: publicProcedure
    .input(
      z.object({
        rankings: z.array(
          z.object({
            nodeAddress: z.string(),
            nodePubkey: z.string().optional(),
            rank: z.number(),
            score: z.number(),
            version: z.string().optional(),
            country: z.string().optional(),
            city: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const snapshots = input.rankings.map((r) => ({
        nodeAddress: r.nodeAddress,
        nodePubkey: r.nodePubkey || null,
        rank: r.rank,
        score: r.score,
        version: r.version || null,
        country: r.country || null,
        city: r.city || null,
      }));

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      await db.insert(rankingSnapshots).values(snapshots);

      return { success: true, count: snapshots.length };
    }),

  /**
   * Get historical snapshots for trend analysis
   */
  getSnapshots: publicProcedure
    .input(
      z.object({
        nodeAddress: z.string().optional(),
        days: z.number().default(7),
      })
    )
    .query(async ({ input }) => {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - input.days);

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      let snapshots;
      if (input.nodeAddress) {
        snapshots = await db
          .select()
          .from(rankingSnapshots)
          .where(
            and(
              eq(rankingSnapshots.nodeAddress, input.nodeAddress),
              gte(rankingSnapshots.snapshotDate, daysAgo)
            )
          )
          .orderBy(desc(rankingSnapshots.snapshotDate));
      } else {
        snapshots = await db
          .select()
          .from(rankingSnapshots)
          .where(gte(rankingSnapshots.snapshotDate, daysAgo))
          .orderBy(desc(rankingSnapshots.snapshotDate));
      }
      return snapshots;
    }),

  /**
   * Get latest snapshot for each node (for trend comparison)
   */
  getLatestSnapshots: publicProcedure.query(async () => {
    // Get snapshots from the last 24 hours
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

    const yesterday = new Date();
    yesterday.setHours(yesterday.getHours() - 24);

    const snapshots = await db
      .select()
      .from(rankingSnapshots)
      .where(gte(rankingSnapshots.snapshotDate, yesterday))
      .orderBy(desc(rankingSnapshots.snapshotDate));

    // Group by nodeAddress and keep only the latest
    const latestByNode = new Map<string, typeof snapshots[0]>();
    for (const snapshot of snapshots) {
      if (!latestByNode.has(snapshot.nodeAddress)) {
        latestByNode.set(snapshot.nodeAddress, snapshot);
      }
    }

    return Array.from(latestByNode.values());
  }),

  /**
   * Award a badge to a node
   */
  awardBadge: publicProcedure
    .input(
      z.object({
        nodeAddress: z.string(),
        badgeType: z.enum([
          "stable_champion",
          "latest_version",
          "geographic_pioneer",
          "uptime_hero",
        ]),
        badgeName: z.string(),
        badgeDescription: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Check if badge already exists
      const existing = await db
        .select()
        .from(nodeBadges)
        .where(
          and(
            eq(nodeBadges.nodeAddress, input.nodeAddress),
            eq(nodeBadges.badgeType, input.badgeType),
            eq(nodeBadges.isActive, 1)
          )
        );

      if (existing.length > 0) {
        return { success: true, alreadyAwarded: true };
      }

      await db.insert(nodeBadges).values({
        nodeAddress: input.nodeAddress,
        badgeType: input.badgeType,
        badgeName: input.badgeName,
        badgeDescription: input.badgeDescription || null,
        isActive: 1,
      });

      return { success: true, alreadyAwarded: false };
    }),

  /**
   * Get badges for a specific node
   */
  getNodeBadges: publicProcedure
    .input(z.object({ nodeAddress: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const badges = await db
        .select()
        .from(nodeBadges)
        .where(
          and(
            eq(nodeBadges.nodeAddress, input.nodeAddress),
            eq(nodeBadges.isActive, 1)
          )
        )
        .orderBy(desc(nodeBadges.earnedAt));

      return badges;
    }),

  /**
   * Get all active badges (for leaderboard display)
   */
  getAllBadges: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

    const badges = await db
      .select()
      .from(nodeBadges)
      .where(eq(nodeBadges.isActive, 1))
      .orderBy(desc(nodeBadges.earnedAt));

    return badges;
  }),

  /**
   * Get leaderboard history (daily top 10)
   */
  getLeaderboardHistory: publicProcedure
    .input(z.object({ days: z.number().default(30) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - input.days);

      const snapshots = await db
        .select()
        .from(rankingSnapshots)
        .where(
          and(
            gte(rankingSnapshots.snapshotDate, daysAgo),
            gte(rankingSnapshots.rank, 1),
            gte(rankingSnapshots.rank, 10)
          )
        )
        .orderBy(desc(rankingSnapshots.snapshotDate));

      // Group by date
      const byDate = new Map<string, RankingSnapshot[]>();
      for (const snapshot of snapshots) {
        const dateKey = snapshot.snapshotDate.toISOString().split("T")[0];
        if (!byDate.has(dateKey)) {
          byDate.set(dateKey, []);
        }
        byDate.get(dateKey)!.push(snapshot);
      }

      return Array.from(byDate.entries()).map(([date, nodes]) => ({
        date,
        nodes: nodes.sort((a: RankingSnapshot, b: RankingSnapshot) => a.rank - b.rank).slice(0, 10),
      }));
    }),
});
