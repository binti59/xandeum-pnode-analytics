/**
 * Storage Credits Service
 * Fetches pod credits data from podcredits.xandeum.network API
 */

export interface PodCredit {
  pod_id: string;
  credits: number;
}

interface PodCreditsResponse {
  pods_credits: PodCredit[];
}

const CREDITS_API_URL = "/api/trpc/credits.getPodCredits";
const CACHE_KEY = "xandeum_pod_credits_cache";
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

interface CachedCredits {
  data: Map<string, number>;
  timestamp: number;
}

let creditsCache: Map<string, number> | null = null;
let lastFetchTime = 0;

/**
 * Fetch storage credits from the API
 */
export async function fetchStorageCredits(): Promise<Map<string, number>> {
  // Check if cache is still valid
  if (creditsCache && Date.now() - lastFetchTime < CACHE_DURATION) {
    return creditsCache;
  }

  // Try to load from localStorage first
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed: CachedCredits = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_DURATION) {
        creditsCache = new Map(Object.entries(parsed.data));
        lastFetchTime = parsed.timestamp;
        return creditsCache;
      }
    }
  } catch (e) {
    console.error("Failed to load credits from cache:", e);
  }

  // Fetch fresh data via backend proxy
  try {
    const response = await fetch(CREDITS_API_URL);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    const data: PodCreditsResponse = result.result.data.json;
    
    // Convert to Map for efficient lookups
    const creditsMap = new Map<string, number>();
    data.pods_credits.forEach(pod => {
      creditsMap.set(pod.pod_id, pod.credits);
    });

    // Update cache
    creditsCache = creditsMap;
    lastFetchTime = Date.now();

    // Save to localStorage
    try {
      const cacheData: CachedCredits = {
        data: Object.fromEntries(creditsMap) as any,
        timestamp: lastFetchTime
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (e) {
      console.error("Failed to save credits to cache:", e);
    }

    return creditsMap;
  } catch (error) {
    console.error("Failed to fetch storage credits:", error);
    
    // Return empty map on error
    if (!creditsCache) {
      creditsCache = new Map();
    }
    return creditsCache;
  }
}

/**
 * Get credits for a specific pod by public key
 */
export function getCreditsForPod(pubkey: string | undefined): number | null {
  if (!pubkey || !creditsCache) {
    return null;
  }
  return creditsCache.get(pubkey) ?? null;
}

/**
 * Clear the credits cache
 */
export function clearCreditsCache(): void {
  creditsCache = null;
  lastFetchTime = 0;
  localStorage.removeItem(CACHE_KEY);
}

/**
 * Format credits number with thousands separator
 */
export function formatCredits(credits: number): string {
  return credits.toLocaleString();
}
