import { Request, Response } from "express";
import axios from "axios";
import { extractIP, lookupGeo } from "./geo";

/**
 * REST endpoint for proxying pNode RPC calls
 * Follows Xandeum pRPC protocol (JSON-RPC 2.0)
 */
export async function proxyRpcHandler(req: Request, res: Response) {
  try {
    const { endpoint, method, params, timeout = 10000 } = req.body;

    // Validate required fields
    if (!endpoint || typeof endpoint !== "string") {
      return res.status(400).json({
        error: "Missing or invalid 'endpoint' field",
      });
    }

    if (!method || typeof method !== "string") {
      return res.status(400).json({
        error: "Missing or invalid 'method' field",
      });
    }

    // Build JSON-RPC 2.0 request
    const rpcBody: any = {
      jsonrpc: "2.0",
      id: 1,
      method,
    };

    // Only include params if provided and not empty
    if (params !== undefined && params !== null && (
      !Array.isArray(params) || params.length > 0
    )) {
      rpcBody.params = params;
    }

    // Make RPC request to pNode
    const response = await axios.post(
      endpoint,
      rpcBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout,
      }
    );

    // Enrich response with geographic data if it contains pods
    const rpcData = response.data;
    
    if (rpcData.result && rpcData.result.pods && Array.isArray(rpcData.result.pods)) {
      rpcData.result.pods = rpcData.result.pods.map((pod: any) => {
        const ip = extractIP(pod.address);
        const geo = lookupGeo(ip);
        
        return {
          ...pod,
          geo: geo ? {
            country: geo.country,
            city: geo.city,
            flag: geo.flag,
          } : null,
        };
      });
    }
    
    // Return JSON-RPC response
    res.json(rpcData);
  } catch (error: any) {
    if (error.response) {
      // RPC server returned an error
      res.status(error.response.status).json({
        error: `RPC Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`,
      });
    } else if (error.request) {
      // Network error - node unreachable
      res.status(503).json({
        error: `Network Error: Unable to reach ${req.body.endpoint}`,
      });
    } else {
      // Other error
      res.status(500).json({
        error: `Request Error: ${error.message}`,
      });
    }
  }
}
