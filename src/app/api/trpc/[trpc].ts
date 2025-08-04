/**
 * This file contains tRPC's HTTP response handler
 */
import * as trpcNext from '@trpc/server/adapters/next';
import { createContext } from '@/trpc/context';
import { appRouter } from '@/trpc/routers/_app';
import { TRPCError } from '@trpc/server';
import { getHTTPStatusCodeFromError } from '@trpc/server/http';

export default trpcNext.createNextApiHandler({
  router: appRouter,
  /**
   * @see https://trpc.io/docs/v11/context
   */
  createContext,
  /**
   * @see https://trpc.io/docs/v11/error-handling
   */
  onError({ error }: { error: Error }) {
    if (error instanceof TRPCError) {
        console.dir({'Raw TRPC Error': error});
      const httpCode = getHTTPStatusCodeFromError(error);
      console.log(httpCode); // 400
    }
      console.error('Error occurred', error);
    }
  },
  /**
   * @see https://trpc.io/docs/v11/caching#api-response-caching
   */
  // responseMeta() {
  //   // ...
  // },
});
