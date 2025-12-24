// Watchlist management using localStorage
// Allows users to save and monitor favorite nodes

const WATCHLIST_KEY = 'xandeum_watchlist';

export interface WatchlistNode {
  address: string;
  addedAt: number; // Unix timestamp
}

/**
 * Get all nodes in the watchlist
 */
export function getWatchlist(): WatchlistNode[] {
  try {
    const stored = localStorage.getItem(WATCHLIST_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as WatchlistNode[];
  } catch (error) {
    console.error('Failed to load watchlist:', error);
    return [];
  }
}

/**
 * Check if a node is in the watchlist
 */
export function isInWatchlist(address: string): boolean {
  const watchlist = getWatchlist();
  return watchlist.some(node => node.address === address);
}

/**
 * Add a node to the watchlist
 */
export function addToWatchlist(address: string): void {
  try {
    const watchlist = getWatchlist();
    
    // Don't add duplicates
    if (watchlist.some(node => node.address === address)) {
      return;
    }
    
    watchlist.push({
      address,
      addedAt: Date.now(),
    });
    
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
  } catch (error) {
    console.error('Failed to add to watchlist:', error);
  }
}

/**
 * Remove a node from the watchlist
 */
export function removeFromWatchlist(address: string): void {
  try {
    const watchlist = getWatchlist();
    const filtered = watchlist.filter(node => node.address !== address);
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to remove from watchlist:', error);
  }
}

/**
 * Toggle a node in/out of the watchlist
 */
export function toggleWatchlist(address: string): boolean {
  const inWatchlist = isInWatchlist(address);
  
  if (inWatchlist) {
    removeFromWatchlist(address);
    return false;
  } else {
    addToWatchlist(address);
    return true;
  }
}

/**
 * Get watchlist count
 */
export function getWatchlistCount(): number {
  return getWatchlist().length;
}

/**
 * Clear entire watchlist
 */
export function clearWatchlist(): void {
  try {
    localStorage.removeItem(WATCHLIST_KEY);
  } catch (error) {
    console.error('Failed to clear watchlist:', error);
  }
}
