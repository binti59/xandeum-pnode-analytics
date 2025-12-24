/**
 * Automated Performance Data Collection
 * Periodically queries all accessible nodes and stores performance snapshots
 * Runs every 5 minutes to build comprehensive historical data
 */

import { statsCache } from "./statsCache";
import { addPerformanceSnapshot } from "./performanceHistory";

const COLLECTION_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const REQUEST_TIMEOUT_MS = 10000; // 10 seconds per node
const BATCH_DELAY_MS = 500; // 500ms delay between requests

export interface CollectionProgress {
  total: number;
  completed: number;
  successful: number;
  failed: number;
  lastCollectionTime: number | null;
}

let collectionIntervalId: number | null = null;
let isCollecting = false;
let progress: CollectionProgress = {
  total: 0,
  completed: 0,
  successful: 0,
  failed: 0,
  lastCollectionTime: null,
};

type ProgressCallback = (progress: CollectionProgress) => void;
let progressCallback: ProgressCallback | null = null;

/**
 * Fetch stats for a single node
 */
async function fetchNodeStats(nodeAddress: string): Promise<any | null> {
  try {
    const nodeIP = nodeAddress.split(":")[0];
    const endpoint = `http://${nodeIP}:6000/rpc`;

    const response = await fetch("/api/proxy-rpc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        endpoint,
        method: "get-stats",
        timeout: REQUEST_TIMEOUT_MS,
      }),
    });

    if (response.ok) {
      const rpcResponse = await response.json();
      if (rpcResponse && rpcResponse.result) {
        return rpcResponse.result;
      }
    }
    return null;
  } catch (error) {
    console.error(`[PerformanceCollector] Failed to fetch stats for ${nodeAddress}:`, error);
    return null;
  }
}

/**
 * Collect performance data from all accessible nodes
 */
async function collectPerformanceData() {
  if (isCollecting) {
    console.log("[PerformanceCollector] Collection already in progress, skipping...");
    return;
  }

  isCollecting = true;
  console.log("[PerformanceCollector] Starting automated performance data collection...");

  // Get all accessible nodes from statsCache
  const accessibleNodes = statsCache.getAllAccessible();

  progress = {
    total: accessibleNodes.length,
    completed: 0,
    successful: 0,
    failed: 0,
    lastCollectionTime: Date.now(),
  };

  console.log(`[PerformanceCollector] Found ${accessibleNodes.length} accessible nodes to query`);

  if (progressCallback) {
    progressCallback(progress);
  }

  // Query each accessible node sequentially with delay
  for (const nodeAddress of accessibleNodes) {
    const stats = await fetchNodeStats(nodeAddress);

    if (stats && stats.uptime !== undefined) {
      // Successfully fetched stats, add to performance history
      addPerformanceSnapshot(nodeAddress, {
        cpu: stats.cpu_percent || 0,
        ram: stats.ram_used || 0,
        ramTotal: stats.ram_total || 4294967296,
        uptime: stats.uptime || 0,
        activeStreams: stats.active_streams || 0,
        packetsReceived: stats.packets_received || 0,
        packetsSent: stats.packets_sent || 0,
        storage: stats.file_size || 0,
      });
      progress.successful++;
      console.log(`[PerformanceCollector] ✓ Collected data for ${nodeAddress}`);
    } else {
      progress.failed++;
      console.log(`[PerformanceCollector] ✗ Failed to collect data for ${nodeAddress}`);
    }

    progress.completed++;

    if (progressCallback) {
      progressCallback(progress);
    }

    // Add delay between requests to avoid overloading backend
    if (progress.completed < accessibleNodes.length) {
      await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY_MS));
    }
  }

  console.log(
    `[PerformanceCollector] Collection complete: ${progress.successful} successful, ${progress.failed} failed`
  );

  isCollecting = false;
}

/**
 * Start automated performance data collection
 */
export function startPerformanceCollection(callback?: ProgressCallback) {
  if (collectionIntervalId !== null) {
    console.log("[PerformanceCollector] Already running");
    return;
  }

  if (callback) {
    progressCallback = callback;
  }

  console.log("[PerformanceCollector] Starting automated collection (every 5 minutes)");

  // Run first collection immediately
  collectPerformanceData();

  // Schedule periodic collection
  collectionIntervalId = window.setInterval(() => {
    collectPerformanceData();
  }, COLLECTION_INTERVAL_MS);
}

/**
 * Stop automated performance data collection
 */
export function stopPerformanceCollection() {
  if (collectionIntervalId !== null) {
    console.log("[PerformanceCollector] Stopping automated collection");
    window.clearInterval(collectionIntervalId);
    collectionIntervalId = null;
    progressCallback = null;
  }
}

/**
 * Get current collection progress
 */
export function getCollectionProgress(): CollectionProgress {
  return { ...progress };
}

/**
 * Check if collection is currently running
 */
export function isCollectionRunning(): boolean {
  return collectionIntervalId !== null;
}

/**
 * Manually trigger a collection cycle
 */
export function triggerCollection(callback?: ProgressCallback) {
  if (callback) {
    progressCallback = callback;
  }
  collectPerformanceData();
}
