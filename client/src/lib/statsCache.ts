import { NodeStats } from "@/services/prpc";

interface CachedStats {
  stats: NodeStats;
  timestamp: number;
  accessible: boolean;
}

const CACHE_KEY_PREFIX = "node_stats_";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const statsCache = {
  get(nodeAddress: string): CachedStats | null {
    try {
      const key = CACHE_KEY_PREFIX + nodeAddress;
      const cached = localStorage.getItem(key);
      
      if (!cached) return null;
      
      const data: CachedStats = JSON.parse(cached);
      const now = Date.now();
      
      // Check if cache is still valid
      if (now - data.timestamp > CACHE_DURATION) {
        localStorage.removeItem(key);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error("Error reading from stats cache:", error);
      return null;
    }
  },

  set(nodeAddress: string, stats: NodeStats, accessible: boolean): void {
    try {
      const key = CACHE_KEY_PREFIX + nodeAddress;
      const data: CachedStats = {
        stats,
        timestamp: Date.now(),
        accessible,
      };
      
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error("Error writing to stats cache:", error);
    }
  },

  setInaccessible(nodeAddress: string): void {
    try {
      const key = CACHE_KEY_PREFIX + nodeAddress;
      const data: CachedStats = {
        stats: {} as NodeStats,
        timestamp: Date.now(),
        accessible: false,
      };
      
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error("Error writing to stats cache:", error);
    }
  },

  clear(nodeAddress?: string): void {
    try {
      if (nodeAddress) {
        const key = CACHE_KEY_PREFIX + nodeAddress;
        localStorage.removeItem(key);
      } else {
        // Clear all node stats caches
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith(CACHE_KEY_PREFIX)) {
            localStorage.removeItem(key);
          }
        });
      }
    } catch (error) {
      console.error("Error clearing stats cache:", error);
    }
  },
};
