// import { initTRPC, type inferAsyncReturnType } from '@trpc/server';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { prisma } from './db';
// import { getSession } from 'next-auth/react';

// eslint-disable-next-line @typescript-eslint/require-await
export const createContext = async (_opts: CreateNextContextOptions) => {
  // const session = await getSession({ req: opts.req });

  return {
    prisma,
    // session,
  };
};