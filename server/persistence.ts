import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { nodeStats, performanceHistory, watchlist, NodeStats, PerformanceHistory, Watchlist } from "../drizzle/schema";
import { eq, desc, and, gte } from "drizzle-orm";

export const persistenceRouter = router({
  // Node Stats endpoints
  saveNodeStats: publicProcedure
    .input(
      z.object({
        nodeAddress: z.string(),
        nodePubkey: z.string().optional(),
        stats: z.any(),
        accessible: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const existing = await db
        .select()
        .from(nodeStats)
        .where(eq(nodeStats.nodeAddress, input.nodeAddress))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(nodeStats)
          .set({
            nodePubkey: input.nodePubkey,
            stats: JSON.stringify(input.stats),
            accessible: input.accessible ? 1 : 0,
            lastScanned: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(nodeStats.nodeAddress, input.nodeAddress));
      } else {
        await db.insert(nodeStats).values({
          nodeAddress: input.nodeAddress,
          nodePubkey: input.nodePubkey,
          stats: JSON.stringify(input.stats),
          accessible: input.accessible ? 1 : 0,
          lastScanned: new Date(),
        });
      }

      return { success: true };
    }),

  getNodeStats: publicProcedure
    .input(z.object({ nodeAddress: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const result = await db
        .select()
        .from(nodeStats)
        .where(eq(nodeStats.nodeAddress, input.nodeAddress))
        .limit(1);

      if (result.length === 0) return null;

      const node: NodeStats = result[0];
      return {
        stats: JSON.parse(node.stats),
        accessible: node.accessible === 1,
        timestamp: node.lastScanned.getTime(),
      };
    }),

  getAllNodeStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    const results = await db.select().from(nodeStats);

    return results.map((node: NodeStats) => ({
      address: node.nodeAddress,
      pubkey: node.nodePubkey,
      stats: JSON.parse(node.stats),
      accessible: node.accessible === 1,
      timestamp: node.lastScanned.getTime(),
    }));
  }),

  // Performance History endpoints
  savePerformanceSnapshot: publicProcedure
    .input(
      z.object({
        nodeAddress: z.string(),
        snapshot: z.any(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.insert(performanceHistory).values({
        nodeAddress: input.nodeAddress,
        snapshot: JSON.stringify(input.snapshot),
        timestamp: new Date(),
      });

      // Cleanup old snapshots (older than 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      await db
        .delete(performanceHistory)
        .where(
          and(
            eq(performanceHistory.nodeAddress, input.nodeAddress),
            gte(performanceHistory.timestamp, sevenDaysAgo)
          )
        );

      return { success: true };
    }),

  getPerformanceHistory: publicProcedure
    .input(z.object({ nodeAddress: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const results = await db
        .select()
        .from(performanceHistory)
        .where(eq(performanceHistory.nodeAddress, input.nodeAddress))
        .orderBy(desc(performanceHistory.timestamp));

      return results.map((record: PerformanceHistory) => ({
        snapshot: JSON.parse(record.snapshot),
        timestamp: record.timestamp.getTime(),
      }));
    }),

  // Watchlist endpoints
  addToWatchlist: publicProcedure
    .input(
      z.object({
        nodeAddress: z.string(),
        nodePubkey: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        await db.insert(watchlist).values({
          nodeAddress: input.nodeAddress,
          nodePubkey: input.nodePubkey,
        });
        return { success: true };
      } catch (error) {
        // Ignore duplicate key errors
        return { success: true };
      }
    }),

  removeFromWatchlist: publicProcedure
    .input(z.object({ nodeAddress: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .delete(watchlist)
        .where(eq(watchlist.nodeAddress, input.nodeAddress));
      return { success: true };
    }),

  getWatchlist: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    const results = await db.select().from(watchlist);
    return results.map((item: Watchlist) => ({
      address: item.nodeAddress,
      pubkey: item.nodePubkey,
      addedAt: item.addedAt.getTime(),
    }));
  }),

  isInWatchlist: publicProcedure
    .input(z.object({ nodeAddress: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return false;

      const result = await db
        .select()
        .from(watchlist)
        .where(eq(watchlist.nodeAddress, input.nodeAddress))
        .limit(1);
      return result.length > 0;
    }),
});
