import { Pod } from "@/services/prpc";
import { statsCache } from "./statsCache";

const RPC_SCAN_INTERVAL = 30 * 60 * 1000; // 30 minutes
const RPC_PORT = 6000;
const RPC_TIMEOUT = 10000; // 10 seconds (increased from 5 for better detection)

interface ScanProgress {
  total: number;
  scanned: number;
  accessible: number;
  isScanning: boolean;
}

type ScanProgressCallback = (progress: ScanProgress) => void;

let scanInterval: NodeJS.Timeout | null = null;
let progressCallback: ScanProgressCallback | null = null;

/**
 * Check if a single node's RPC port is accessible
 */
async function checkNodeRpcAccessibility(nodeAddress: string): Promise<boolean> {
  const nodeIP = nodeAddress.split(':')[0];
  const endpoint = `http://${nodeIP}:${RPC_PORT}/rpc`;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), RPC_TIMEOUT);

    console.log(`[RPC Scanner] Testing ${nodeIP}...`);
    
    const response = await fetch("/api/proxy-rpc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        endpoint,
        method: "get-stats",
        timeout: RPC_TIMEOUT,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const rpcResponse = await response.json();
      
      // Check if we got a valid JSON-RPC 2.0 response with stats
      const isAccessible = rpcResponse && !rpcResponse.error && rpcResponse.result !== undefined;
      
      if (isAccessible) {
        console.log(`[RPC Scanner] ✅ ${nodeIP} - ACCESSIBLE`, rpcResponse.result);
      } else {
        console.log(`[RPC Scanner] ❌ ${nodeIP} - Invalid response:`, rpcResponse);
      }
      
      return isAccessible;
    } else {
      console.log(`[RPC Scanner] ❌ ${nodeIP} - HTTP ${response.status}:`, await response.text());
    }

    return false;
  } catch (error: any) {
    // Timeout or network error means RPC is not accessible
    if (error.name === 'AbortError') {
      console.log(`[RPC Scanner] ⏱️ ${nodeIP} - TIMEOUT (>${RPC_TIMEOUT}ms)`);
    } else {
      console.log(`[RPC Scanner] 🔌 ${nodeIP} - Network error:`, error.message);
    }
    return false;
  }
}

/**
 * Scan all nodes for RPC accessibility and update cache
 */
export async function scanAllNodesRpcAccessibility(
  nodes: Pod[],
  onProgress?: ScanProgressCallback
): Promise<void> {
  const progress: ScanProgress = {
    total: nodes.length,
    scanned: 0,
    accessible: 0,
    isScanning: true,
  };

  if (onProgress) {
    onProgress({ ...progress });
  }

  // Process nodes in batches to avoid overwhelming the server
  const BATCH_SIZE = 3; // Reduced from 5 to give each node more time
  for (let i = 0; i < nodes.length; i += BATCH_SIZE) {
    const batch = nodes.slice(i, i + BATCH_SIZE);
    
    await Promise.all(
      batch.map(async (node) => {
        const isAccessible = await checkNodeRpcAccessibility(node.address);
        
        if (isAccessible) {
          progress.accessible++;
          // Cache as accessible (we don't have full stats yet, but we know it's reachable)
          statsCache.set(node.address, {} as any, true);
        } else {
          statsCache.setInaccessible(node.address);
        }
        
        progress.scanned++;
        
        if (onProgress) {
          onProgress({ ...progress });
        }
      })
    );
  }

  progress.isScanning = false;
  if (onProgress) {
    onProgress({ ...progress });
  }
}

/**
 * Start background RPC scanning
 */
export function startBackgroundRpcScanning(
  getNodes: () => Pod[],
  onProgress?: ScanProgressCallback
): void {
  // Store progress callback
  progressCallback = onProgress || null;

  // Run initial scan
  const nodes = getNodes();
  if (nodes.length > 0) {
    scanAllNodesRpcAccessibility(nodes, progressCallback || undefined);
  }

  // Set up periodic scanning
  if (scanInterval) {
    clearInterval(scanInterval);
  }

  scanInterval = setInterval(() => {
    const nodes = getNodes();
    if (nodes.length > 0) {
      scanAllNodesRpcAccessibility(nodes, progressCallback || undefined);
    }
  }, RPC_SCAN_INTERVAL);
}

/**
 * Stop background RPC scanning
 */
export function stopBackgroundRpcScanning(): void {
  if (scanInterval) {
    clearInterval(scanInterval);
    scanInterval = null;
  }
  progressCallback = null;
}

/**
 * Get count of accessible nodes from cache
 */
export function getAccessibleNodesCount(): number {
  let count = 0;
  const keys = Object.keys(localStorage);
  
  keys.forEach(key => {
    if (key.startsWith("node_stats_")) {
      try {
        const cached = JSON.parse(localStorage.getItem(key) || "");
        if (cached.accessible === true) {
          count++;
        }
      } catch (error) {
        // Ignore parse errors
      }
    }
  });
  
  return count;
}
