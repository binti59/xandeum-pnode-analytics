/**
 * Utility for calling TRPC mutations from outside React components
 * This properly handles the TRPC batch format and superjson serialization
 */

import SuperJSON from 'superjson';

interface TRPCMutationInput {
  nodeAddress: string;
  stats: any;
  accessible: boolean;
  nodePubkey?: string;
}

/**
 * Call a TRPC mutation with proper formatting
 */
export async function callTRPCMutation(
  procedure: string,
  input: TRPCMutationInput
): Promise<any> {
  try {
    // TRPC batch format with superjson
    const batch = {
      "0": {
        json: input,
        meta: {}
      }
    };

    const response = await fetch(`/api/trpc/${procedure}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(batch),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`TRPC mutation failed: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    
    // TRPC batch response format
    if (result && result[0]) {
      if (result[0].error) {
        throw new Error(`TRPC error: ${JSON.stringify(result[0].error)}`);
      }
      return result[0].result;
    }

    return result;
  } catch (error) {
    console.error(`Failed to call TRPC mutation ${procedure}:`, error);
    throw error;
  }
}

/**
 * Save node stats to database via TRPC
 */
export async function saveNodeStatsToDatabase(
  nodeAddress: string,
  stats: any,
  accessible: boolean,
  nodePubkey?: string
): Promise<void> {
  await callTRPCMutation('persistence.saveNodeStats', {
    nodeAddress,
    stats,
    accessible,
    nodePubkey,
  });
}
