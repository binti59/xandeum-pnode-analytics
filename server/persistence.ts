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

      // Check by pubkey first (preferred), then by address as fallback
      let existing = null;
      let addressMatch = null;
      
      if (input.nodePubkey) {
        const byPubkey = await db
          .select()
          .from(nodeStats)
          .where(eq(nodeStats.nodePubkey, input.nodePubkey))
          .limit(1);
        if (byPubkey.length > 0) {
          existing = byPubkey[0];
        }
      }

      // Always check by address to detect potential duplicates
      const byAddress = await db
        .select()
        .from(nodeStats)
        .where(eq(nodeStats.nodeAddress, input.nodeAddress))
        .limit(1);
      if (byAddress.length > 0) {
        addressMatch = byAddress[0];
      }

      // If found by pubkey, update that record
      if (existing) {
        // If address changed, update it
        await db
          .update(nodeStats)
          .set({
            nodeAddress: input.nodeAddress,
            nodePubkey: input.nodePubkey || existing.nodePubkey,
            stats: JSON.stringify(input.stats),
            accessible: input.accessible ? 1 : 0,
            lastScanned: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(nodeStats.id, existing.id));
        
        // If there's also an address match with a different record, delete it (duplicate)
        if (addressMatch && addressMatch.id !== existing.id) {
          await db.delete(nodeStats).where(eq(nodeStats.id, addressMatch.id));
        }
      } else if (addressMatch) {
        // Found by address only - update it (may now have pubkey)
        existing = addressMatch;
      }

      if (existing) {
        // Update existing record (address may have changed)
        await db
          .update(nodeStats)
          .set({
            nodeAddress: input.nodeAddress, // Update address in case it changed
            nodePubkey: input.nodePubkey || existing.nodePubkey, // Keep existing pubkey if new one is missing
            stats: JSON.stringify(input.stats),
            accessible: input.accessible ? 1 : 0,
            lastScanned: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(nodeStats.id, existing.id));
      } else {
        // Insert new record
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

  // Database cleanup - remove duplicate node records
  cleanupDuplicateNodes: publicProcedure
    .mutation(async () => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get all node records
      const allNodes = await db.select().from(nodeStats).orderBy(desc(nodeStats.lastScanned));
      
      // Group by pubkey and address to find duplicates
      const seenPubkeys = new Set<string>();
      const seenAddresses = new Set<string>();
      const toDelete: number[] = [];
      
      for (const node of allNodes) {
        // If node has pubkey, use it as primary identifier
        if (node.nodePubkey) {
          if (seenPubkeys.has(node.nodePubkey)) {
            // Duplicate by pubkey - mark for deletion
            toDelete.push(node.id);
          } else {
            seenPubkeys.add(node.nodePubkey);
          }
        } else {
          // No pubkey, use address
          if (seenAddresses.has(node.nodeAddress)) {
            // Duplicate by address - mark for deletion
            toDelete.push(node.id);
          } else {
            seenAddresses.add(node.nodeAddress);
          }
        }
      }

      // Delete duplicates
      let deletedCount = 0;
      for (const id of toDelete) {
        await db.delete(nodeStats).where(eq(nodeStats.id, id));
        deletedCount++;
      }

      return {
        success: true,
        deletedCount,
        remainingNodes: allNodes.length - deletedCount,
      };
    }),

});
