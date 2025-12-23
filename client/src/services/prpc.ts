// Xandeum pNode RPC Service
// Uses backend proxy to avoid Mixed Content and CORS issues

export interface GeoData {
  country: string;
  city: string;
  flag: string;
}

export interface Pod {
  address: string;
  version: string;
  last_seen: string; // Human readable timestamp
  last_seen_timestamp: number; // Unix timestamp
  
  // Geographic data (enriched by backend)
  geo?: GeoData | null;
  
  // Extended fields (will be added in future API update)
  is_public?: boolean;
  pubkey?: string;
  rpc_port?: number;
  storage_committed?: number; // Bytes
  storage_used?: number; // Bytes
  storage_usage_percent?: number;
  uptime?: number; // Seconds
}

export interface NodeStats {
  metadata: {
    total_bytes: number;
    total_pages: number;
    last_updated: number; // Unix timestamp
    current_index?: number;
  };
  stats: {
    cpu_percent: number;
    ram_used: number;
    ram_total: number;
    uptime: number; // Seconds
    packets_received: number;
    packets_sent: number;
    active_streams: number;
  };
  file_size: number; // Storage file size in bytes
}

export interface GetPodsResult {
  pods: Pod[];
  total_count: number;
}

export interface JsonRpcResponse<T> {
  jsonrpc: "2.0";
  result: T;
  id: number;
  error?: {
    code: number;
    message: string;
  };
}

// Default to public node for testing
// User can change this in settings
export const DEFAULT_RPC_ENDPOINT = "http://192.190.136.36:6000/rpc";

/**
 * Fetch all pNodes using the backend proxy
 * This resolves Mixed Content (HTTPS/HTTP) and CORS issues
 */
export const getPods = async (endpoint: string = DEFAULT_RPC_ENDPOINT): Promise<Pod[]> => {
  try {
    // Use backend REST proxy endpoint
    const response = await fetch("/api/proxy-rpc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        endpoint,
        method: "get-pods",
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rpcResponse = await response.json() as JsonRpcResponse<GetPodsResult>;

    if (!rpcResponse) {
      throw new Error("Invalid response format from proxy");
    }

    if (rpcResponse.error) {
      throw new Error(`RPC error: ${rpcResponse.error.message}`);
    }

    return rpcResponse.result.pods;
  } catch (error) {
    console.error("Failed to fetch pods:", error);
    throw error;
  }
};

/**
 * Fetch detailed stats for a specific node
 * Uses public RPC node as fallback since most nodes don't expose port 6000 publicly
 * @param nodeAddress - The IP:port address of the node (e.g., "192.190.136.36:6000")
 */
export async function getNodeStats(nodeAddress: string, customEndpoint?: string): Promise<NodeStats> {
  // Use custom endpoint if provided, otherwise fall back to public RPC node
  // Most nodes only expose gossip port (9001), not RPC port (6000)
  const endpoint = customEndpoint || DEFAULT_RPC_ENDPOINT;

  try {
    const response = await fetch("/api/proxy-rpc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        endpoint,
        method: "get-stats",
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rpcResponse = await response.json() as JsonRpcResponse<NodeStats>;

    if (!rpcResponse) {
      throw new Error("Invalid response format from proxy");
    }

    if (rpcResponse.error) {
      throw new Error(`RPC error: ${rpcResponse.error.message}`);
    }

    return rpcResponse.result;
  } catch (error) {
    console.error(`Failed to fetch stats for node ${nodeAddress}:`, error);
    throw error;
  }
};

/**
 * Format uptime in seconds to human-readable string
 * Example: 345600 seconds -> "4d 0h"
 */
export function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

/**
 * Format storage in bytes to GB
 * Example: 1073741824 -> "1.00 GB"
 */
export function formatStorage(bytes: number): string {
  const gb = bytes / (1024 * 1024 * 1024);
  return `${gb.toFixed(2)} GB`;
}

/**
 * Format RAM in bytes to GB
 * Example: 8589934592 -> "8.00 GB"
 */
export function formatRAM(bytes: number): string {
  const gb = bytes / (1024 * 1024 * 1024);
  return `${gb.toFixed(2)} GB`;
}

/**
 * Get status badge color based on last seen timestamp
 */
export function getStatusColor(lastSeenTimestamp: number): "green" | "yellow" | "red" {
  const now = Date.now() / 1000; // Convert to seconds
  const timeSinceLastSeen = now - lastSeenTimestamp;
  
  if (timeSinceLastSeen < 300) return "green"; // < 5 minutes
  if (timeSinceLastSeen < 3600) return "yellow"; // < 1 hour
  return "red"; // > 1 hour
}
