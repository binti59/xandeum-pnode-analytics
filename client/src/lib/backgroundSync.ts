import { statsCache } from "@/lib/statsCache";
import { trpcVanilla } from "@/lib/trpcVanilla";

const SYNC_INTERVAL = 1 * 60 * 1000; // Sync every 1 minute
const CACHE_KEY_PREFIX = "node_stats_";
const WATCHLIST_KEY = "watchlist";

/**
 * Sync node stats from localStorage to database
 */
export async function performSync(): Promise<{ nodesSynced: number; watchlistSynced: boolean }> {
  try {
    let synced = 0;

    // Sync node stats
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (!key.startsWith(CACHE_KEY_PREFIX)) continue;

      try {
        const nodeAddress = key.substring(CACHE_KEY_PREFIX.length);
        const cached = statsCache.get(nodeAddress);
        
        if (cached) {
          // Use vanilla TRPC client for mutation
          await trpcVanilla.persistence.saveNodeStats.mutate({
            nodeAddress,
            stats: cached.stats,
            accessible: cached.accessible,
            nodePubkey: undefined, // Pubkey is on Pod interface, not NodeStats
          });
          synced++;
        }
      } catch (error) {
        console.error(`Error syncing node ${key}:`, error);
      }
    }

    // Sync watchlist
    const watchlistSynced = await syncWatchlist();

    return { nodesSynced: synced, watchlistSynced };
  } catch (error) {
    console.error("Error in performSync:", error);
    throw error;
  }
}

/**
 * Sync watchlist from localStorage to database
 */
async function syncWatchlist(): Promise<boolean> {
  try {
    const watchlistStr = localStorage.getItem(WATCHLIST_KEY);
    if (!watchlistStr) return false;
    
    const watchlist: string[] = JSON.parse(watchlistStr);
    
    // Get current watchlist from database
    const dbWatchlist = await trpcVanilla.persistence.getWatchlist.query();
    const dbAddresses = new Set(dbWatchlist.map((w: any) => w.address));
    
    // Add missing nodes to database
    for (const address of watchlist) {
      if (!dbAddresses.has(address)) {
        await trpcVanilla.persistence.addToWatchlist.mutate({ nodeAddress: address });
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error syncing watchlist:", error);
    return false;
  }
}

/**
 * Load data from database to localStorage on app start
 */
export async function loadFromDatabase(): Promise<void> {
  try {
    // Load node stats from database
    const allNodeStats = await trpcVanilla.persistence.getAllNodeStats.query();
    
    for (const node of allNodeStats) {
      // Only load if not already in cache (don't overwrite fresher data)
      if (!statsCache.get(node.address)) {
        statsCache.set(node.address, node.stats, node.accessible);
      }
    }

    // Load watchlist from database
    const watchlist = await trpcVanilla.persistence.getWatchlist.query();
    const addresses = watchlist.map((w: any) => w.address);
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(addresses));

    console.log(`[Background Sync] Loaded ${allNodeStats.length} nodes and ${addresses.length} watchlist items from database`);
  } catch (error) {
    console.error("Error loading from database:", error);
  }
}

/**
 * Start background sync service
 */
export function startBackgroundSync(): void {
  // Initial sync after 10 seconds
  setTimeout(() => {
    performSync()
      .then(result => {
        console.log(`[Background Sync] Initial sync complete: ${result.nodesSynced} nodes synced`);
      })
      .catch(error => {
        console.error("[Background Sync] Initial sync failed:", error);
      });
  }, 10000);

  // Periodic sync
  setInterval(() => {
    performSync()
      .then(result => {
        console.log(`[Background Sync] Periodic sync complete: ${result.nodesSynced} nodes synced`);
      })
      .catch(error => {
        console.error("[Background Sync] Periodic sync failed:", error);
      });
  }, SYNC_INTERVAL);
}
