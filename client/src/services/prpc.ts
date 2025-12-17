export interface PNode {
  identity: string;
  ip: string;
  version: string;
  lastSeen: number; // unix timestamp
}

export interface PNodeGossipResponse {
  jsonrpc: "2.0";
  result: PNode[];
  id: number;
}

const RPC_ENDPOINT = "https://rpc.xandeum.network";

export const getPNodeGossip = async (): Promise<PNode[]> => {
  try {
    const response = await fetch(RPC_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "getPNodeGossip",
        params: [],
        id: 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: PNodeGossipResponse = await response.json();

    if ("error" in data) {
      // @ts-ignore - handling potential error response structure
      throw new Error(`RPC error: ${data.error.message}`);
    }

    return data.result;
  } catch (error) {
    console.error("Failed to fetch pNode gossip:", error);
    throw error;
  }
};
