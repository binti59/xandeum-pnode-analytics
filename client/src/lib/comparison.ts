// Node comparison management using localStorage
// Allows users to select and compare multiple nodes side-by-side

const COMPARISON_KEY = 'xandeum_comparison';
const MAX_COMPARISON_NODES = 4;

/**
 * Get all nodes selected for comparison
 */
export function getComparisonNodes(): string[] {
  try {
    const stored = localStorage.getItem(COMPARISON_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as string[];
  } catch (error) {
    console.error('Failed to load comparison nodes:', error);
    return [];
  }
}

/**
 * Check if a node is selected for comparison
 */
export function isInComparison(address: string): boolean {
  const nodes = getComparisonNodes();
  return nodes.includes(address);
}

/**
 * Add a node to comparison
 */
export function addToComparison(address: string): boolean {
  try {
    const nodes = getComparisonNodes();
    
    // Check if already in comparison
    if (nodes.includes(address)) {
      return false;
    }
    
    // Check if limit reached
    if (nodes.length >= MAX_COMPARISON_NODES) {
      return false;
    }
    
    nodes.push(address);
    localStorage.setItem(COMPARISON_KEY, JSON.stringify(nodes));
    return true;
  } catch (error) {
    console.error('Failed to add to comparison:', error);
    return false;
  }
}

/**
 * Remove a node from comparison
 */
export function removeFromComparison(address: string): void {
  try {
    const nodes = getComparisonNodes();
    const filtered = nodes.filter(addr => addr !== address);
    localStorage.setItem(COMPARISON_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to remove from comparison:', error);
  }
}

/**
 * Toggle a node in/out of comparison
 */
export function toggleComparison(address: string): boolean {
  const inComparison = isInComparison(address);
  
  if (inComparison) {
    removeFromComparison(address);
    return false;
  } else {
    return addToComparison(address);
  }
}

/**
 * Get comparison count
 */
export function getComparisonCount(): number {
  return getComparisonNodes().length;
}

/**
 * Clear all comparison selections
 */
export function clearComparison(): void {
  try {
    localStorage.removeItem(COMPARISON_KEY);
  } catch (error) {
    console.error('Failed to clear comparison:', error);
  }
}

/**
 * Check if comparison limit reached
 */
export function isComparisonFull(): boolean {
  return getComparisonNodes().length >= MAX_COMPARISON_NODES;
}
