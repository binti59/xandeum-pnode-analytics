export interface Pod {
  address: string;
  version: string;
  last_seen: string; // Human readable timestamp
  last_seen_timestamp: number; // Unix timestamp
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

// Using the endpoint provided in the initial prompt, though docs mention local default.
// In a real scenario, this would likely be a public node or a proxy.
const RPC_ENDPOINT = "https://rpc.xandeum.network";

export const getPods = async (): Promise<Pod[]> => {
  try {
    const response = await fetch(RPC_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "get-pods", // Correct method name from docs
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
