import { statsCache } from "@/lib/statsCache";

// Direct API calls without TRPC hooks (for use outside React components)
const API_BASE = "/api/trpc";

async function apiCall(endpoint: string, input?: any): Promise<any> {
  const url = input !== undefined 
    ? `${API_BASE}/${endpoint}?input=${encodeURIComponent(JSON.stringify(input))}`
    : `${API_BASE}/${endpoint}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  const data = await response.json();
  return data.result.data.json || data.result;
}

const SYNC_INTERVAL = 1 * 60 * 1000; // Sync every 1 minute
const CACHE_KEY_PREFIX = "node_stats_";
const WATCHLIST_KEY = "watchlist";

interface SyncStatus {
  lastSync: Date | null;
  syncing: boolean;
  nodesSynced: number;
  watchlistSynced: boolean;
}

let syncStatus: SyncStatus = {
  lastSync: null,
  syncing: false,
  nodesSynced: 0,
  watchlistSynced: false,
};

let syncInterval: NodeJS.Timeout | null = null;

/**
 * Sync node stats from localStorage to database
 */
async function syncNodeStats(): Promise<number> {
  try {
    const keys = Object.keys(localStorage);
    const nodeKeys = keys.filter(key => key.startsWith(CACHE_KEY_PREFIX));
    
    let synced = 0;
    
    for (const key of nodeKeys) {
      try {
        const nodeAddress = key.substring(CACHE_KEY_PREFIX.length);
        const cached = statsCache.get(nodeAddress);
        
        if (cached) {
          // Save to database
          await apiCall("persistence.saveNodeStats", {
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
    
    return synced;
  } catch (error) {
    console.error("Error syncing node stats:", error);
    return 0;
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
    const dbWatchlist = await apiCall("persistence.getWatchlist");
    const dbAddresses = new Set(dbWatchlist.map((w: any) => w.nodeAddress));
    
    // Add missing nodes to database
    for (const address of watchlist) {
      if (!dbAddresses.has(address)) {
        await apiCall("persistence.addToWatchlist", { nodeAddress: address });
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error syncing watchlist:", error);
    return false;
  }
}

/**
 * Perform full sync from localStorage to database
 */
export async function performSync(): Promise<SyncStatus> {
  if (syncStatus.syncing) {
    console.log("Sync already in progress");
    return syncStatus;
  }
  
  syncStatus.syncing = true;
  
  try {
    console.log("Starting background sync...");
    
    // Sync node stats
    const nodesSynced = await syncNodeStats();
    
    // Sync watchlist
    const watchlistSynced = await syncWatchlist();
    
    syncStatus = {
      lastSync: new Date(),
      syncing: false,
      nodesSynced,
      watchlistSynced,
    };
    
    console.log(`Sync complete: ${nodesSynced} nodes, watchlist: ${watchlistSynced}`);
    
    return syncStatus;
  } catch (error) {
    console.error("Sync failed:", error);
    syncStatus.syncing = false;
    throw error;
  }
}

/**
 * Load data from database to localStorage on app initialization
 */
export async function loadFromDatabase(): Promise<void> {
  try {
    console.log("Loading data from database...");
    
    // Check if localStorage already has data
    const keys = Object.keys(localStorage);
    const hasNodeData = keys.some(key => key.startsWith(CACHE_KEY_PREFIX));
    
    if (hasNodeData) {
      console.log("LocalStorage already has data, skipping load");
      return;
    }
    
    // Load node stats from database
    const allNodeStats = await apiCall("persistence.getAllNodeStats");
    
    for (const node of allNodeStats) {
      statsCache.set(node.nodeAddress, node.stats, node.accessible);
    }
    
    console.log(`Loaded ${allNodeStats.length} nodes from database`);
    
    // Load watchlist from database
    const watchlist = await apiCall("persistence.getWatchlist");
    const addresses = watchlist.map((w: any) => w.nodeAddress);
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(addresses));
    
    console.log(`Loaded ${addresses.length} watchlist items from database`);
  } catch (error) {
    console.error("Error loading from database:", error);
  }
}

/**
 * Start periodic background sync
 */
export function startBackgroundSync(): void {
  if (syncInterval) {
    console.log("Background sync already running");
    return;
  }
  
  console.log("Starting background sync service...");
  
  // Initial sync after 10 seconds
  setTimeout(() => {
    performSync().catch(console.error);
  }, 10000);
  
  // Periodic sync every 5 minutes
  syncInterval = setInterval(() => {
    performSync().catch(console.error);
  }, SYNC_INTERVAL);
}

/**
 * Stop periodic background sync
 */
export function stopBackgroundSync(): void {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
    console.log("Background sync stopped");
  }
}

/**
 * Get current sync status
 */
export function getSyncStatus(): SyncStatus {
  return { ...syncStatus };
}
