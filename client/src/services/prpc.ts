export interface Pod {
  address: string;
  version: string;
  last_seen: string; // Human readable timestamp
  last_seen_timestamp: number; // Unix timestamp
  
  // Extended fields
  is_public?: boolean;
  pubkey?: string;
  rpc_port?: number;
  storage_committed?: number; // Bytes
  storage_used?: number; // Bytes
  storage_usage_percent?: number;
  uptime?: number; // Seconds
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

// Default to port 4000 as requested by user for their specific tunnel setup
export const DEFAULT_RPC_ENDPOINT = "http://localhost:4000/rpc";

export const getPods = async (endpoint: string = DEFAULT_RPC_ENDPOINT): Promise<Pod[]> => {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "get-pods",
        id: 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: JsonRpcResponse<GetPodsResult> = await response.json();

    if (data.error) {
      throw new Error(`RPC error: ${data.error.message}`);
    }

    return data.result.pods;
  } catch (error) {
    console.error("Failed to fetch pods:", error);
    throw error;
  }
};
