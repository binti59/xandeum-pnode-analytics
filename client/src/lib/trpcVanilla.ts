import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../server/routers';
import superjson from 'superjson';

/**
 * Vanilla TRPC client for use outside React components
 * (e.g., in background sync, RPC scanner)
 */
export const trpcVanilla = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: '/api/trpc',
      transformer: superjson,
    }),
  ],
});
