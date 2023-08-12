import { createServerSideHelpers as _createServerSideHelpers } from '@trpc/react-query/server';
import superjson from "superjson";
import { appRouter } from "@/server/api/root";
import { type GetServerSidePropsContext } from 'next';


// https://trpc.io/docs/client/nextjs/server-side-helpers#there-are-2-ways-to-use-the-server-side-helpers
export async function createServerSideHelpers(opt: GetServerSidePropsContext) {
  const { createContext } = await import('@/server/context');

  return _createServerSideHelpers({
    router: appRouter,
    ctx: await createContext(opt),
    transformer: superjson, // optional - adds superjson serialization
  });
}
