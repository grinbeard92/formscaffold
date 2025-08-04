/**
 * This file contains the root router of your tRPC-backend
 */
import { createCallerFactory, publicProcedure, router } from '@/trpc/server';
import { bookRouter } from './book';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),
  book: bookRouter, // Dynamic router based on FormConfiguration
});

export const createCaller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;
