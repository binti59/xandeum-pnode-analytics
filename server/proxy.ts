import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";

/**
 * Proxy router for forwarding RPC requests to pNodes
 * Used by the RPC scanner to test node accessibility
 */
export const proxyRouter = router({
  /**
   * Proxy an RPC request to a pNode
   */
  rpc: publicProcedure
    .input(
      z.object({
        endpoint: z.string().url(),
        method: z.string(),
        params: z.array(z.any()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const response = await fetch(input.endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: input.method,
            params: input.params || [],
          }),
          signal: AbortSignal.timeout(5000), // 5 second timeout
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
      } catch (error: any) {
        // Return error in JSON-RPC format
        return {
          jsonrpc: "2.0",
          id: 1,
          error: {
            code: -32603,
            message: error.message || "Internal error",
          },
        };
      }
    }),
});
