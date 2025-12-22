import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import axios from "axios";
import { extractIP, lookupGeo } from "./geo";
import { rankingsRouter } from "./rankings";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Proxy router for pNode RPC calls
  proxy: router({
    rpc: publicProcedure
      .input(
        z.object({
          endpoint: z.string().url(),
          method: z.string(),
          params: z.any().optional(),
          timeout: z.number().optional().default(10000),
        })
      )
      .mutation(async ({ input }) => {
        try {
          // Build RPC request body
          const rpcBody: any = {
            jsonrpc: "2.0",
            id: 1,
            method: input.method,
          };

          // Only include params if provided and not empty (get-stats doesn't need params)
          if (input.params !== undefined && input.params !== null && (
            !Array.isArray(input.params) || input.params.length > 0
          )) {
            rpcBody.params = input.params;
          }

          const response = await axios.post(
            input.endpoint,
            rpcBody,
            {
              headers: {
                "Content-Type": "application/json",
              },
              timeout: input.timeout,
            }
          );

          // Enrich response with geographic data
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
          
          return rpcData;
        } catch (error: any) {
          if (error.response) {
            throw new Error(
              `RPC Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`
            );
          } else if (error.request) {
            throw new Error(
              `Network Error: Unable to reach ${input.endpoint}. Please check if the node is running and accessible.`
            );
          } else {
            throw new Error(`Request Error: ${error.message}`);
          }
        }
      }),
  }),

  // Rankings router for historical data and badges
  rankings: rankingsRouter,
});

export type AppRouter = typeof appRouter;
