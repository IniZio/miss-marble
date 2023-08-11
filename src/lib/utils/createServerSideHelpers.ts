import { createServerSideHelpers as _createServerSideHelpers } from '@trpc/react-query/server';
import superjson from "superjson";
import { appRouter } from "@/server/api/root";
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';


// https://trpc.io/docs/client/nextjs/server-side-helpers#there-are-2-ways-to-use-the-server-side-helpers
export async function createServerSideHelpers(opt: CreateNextContextOptions) {
  const { createContext } = await import('@/server/context');

  return _createServerSideHelpers({
    router: appRouter,
    ctx: await createContext(opt),
    transformer: superjson, // optional - adds superjson serialization
  });
}
