// import { initTRPC, type inferAsyncReturnType } from '@trpc/server';
import { prisma } from './db';
import { type GetServerSidePropsContext } from 'next';
// import { getSession } from 'next-auth/react';

// eslint-disable-next-line @typescript-eslint/require-await
export const createContext = async (_opts: GetServerSidePropsContext) => {
  // const session = await getSession({ req: opts.req });

  return {
    prisma,
    // session,
  };
};