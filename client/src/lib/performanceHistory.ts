/**
 * Performance History Tracking System
 * Stores historical performance data for accessible nodes in localStorage
 * Maintains a 24-hour rolling window of snapshots taken every 5 minutes
 */

export interface PerformanceSnapshot {
  timestamp: number;
  address: string;
  cpu: number;
  ram: number;
  ramTotal: number;
  uptime: number;
  activeStreams: number;
  packetsReceived: number;
  packetsSent: number;
  storage?: number; // file_size in bytes
}

export interface NodePerformanceHistory {
  address: string;
  snapshots: PerformanceSnapshot[];
}

const STORAGE_KEY = "xandeum_performance_history";
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours
const SNAPSHOT_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Get all performance history from localStorage
 */
export function getPerformanceHistory(): Map<string, NodePerformanceHistory> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return new Map();

    const data = JSON.parse(stored);
    const history = new Map<string, NodePerformanceHistory>();

    // Clean up old snapshots while loading
    const now = Date.now();
    for (const [address, nodeHistory] of Object.entries(data)) {
      const filtered = (nodeHistory as NodePerformanceHistory).snapshots.filter(
        (s) => now - s.timestamp < MAX_AGE_MS
      );
      if (filtered.length > 0) {
        history.set(address, {
          address,
          snapshots: filtered,
        });
      }
    }

    return history;
  } catch (error) {
    console.error("Failed to load performance history:", error);
    return new Map();
  }
}

/**
 * Save performance history to localStorage
 */
function savePerformanceHistory(history: Map<string, NodePerformanceHistory>) {
  try {
    const data: Record<string, NodePerformanceHistory> = {};
    history.forEach((value, key) => {
      data[key] = value;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save performance history:", error);
  }
}

/**
 * Add a performance snapshot for a node
 */
export function addPerformanceSnapshot(
  address: string,
  stats: {
    cpu: number;
    ram: number;
    ramTotal: number;
    uptime: number;
    activeStreams: number;
    packetsReceived: number;
    packetsSent: number;
    storage?: number;
  }
) {
  const history = getPerformanceHistory();
  const now = Date.now();

  // Get or create node history
  let nodeHistory = history.get(address);
  if (!nodeHistory) {
    nodeHistory = {
      address,
      snapshots: [],
    };
    history.set(address, nodeHistory);
  }

  // Check if we should add a new snapshot (5-minute interval)
  const lastSnapshot = nodeHistory.snapshots[nodeHistory.snapshots.length - 1];
  if (!lastSnapshot || now - lastSnapshot.timestamp >= SNAPSHOT_INTERVAL_MS) {
    // Add new snapshot
    nodeHistory.snapshots.push({
      timestamp: now,
      address,
      ...stats,
    });

    // Remove old snapshots
    nodeHistory.snapshots = nodeHistory.snapshots.filter(
      (s) => now - s.timestamp < MAX_AGE_MS
    );

    savePerformanceHistory(history);
  }
}

/**
 * Get performance history for a specific node
 */
export function getNodePerformanceHistory(
  address: string
): PerformanceSnapshot[] {
  const history = getPerformanceHistory();
  return history.get(address)?.snapshots || [];
}

/**
 * Get list of nodes with performance history
 */
export function getNodesWithHistory(): string[] {
  const history = getPerformanceHistory();
  return Array.from(history.keys());
}

/**
 * Clear all performance history
 */
export function clearPerformanceHistory() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Get performance statistics for a node over the past 24 hours
 */
export function getNodePerformanceStats(address: string) {
  const snapshots = getNodePerformanceHistory(address);
  if (snapshots.length === 0) {
    return null;
  }

  const cpuValues = snapshots.map((s) => s.cpu);
  const ramValues = snapshots.map((s) => (s.ram / s.ramTotal) * 100);
  const uptimeValues = snapshots.map((s) => s.uptime);

  return {
    cpu: {
      avg: cpuValues.reduce((a, b) => a + b, 0) / cpuValues.length,
      min: Math.min(...cpuValues),
      max: Math.max(...cpuValues),
    },
    ram: {
      avg: ramValues.reduce((a, b) => a + b, 0) / ramValues.length,
      min: Math.min(...ramValues),
      max: Math.max(...ramValues),
    },
    uptime: {
      current: uptimeValues[uptimeValues.length - 1],
      max: Math.max(...uptimeValues),
    },
    snapshotCount: snapshots.length,
    firstSnapshot: snapshots[0].timestamp,
    lastSnapshot: snapshots[snapshots.length - 1].timestamp,
  };
}
