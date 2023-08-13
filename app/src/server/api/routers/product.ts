import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const productRouter = createTRPCRouter({
  paginate: publicProcedure.input(
    z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(),
      filter: z.object({ collectionSlug: z.string().nullish() }).nullish(),
    }),
  ).query(async ({ input, ctx }) => {
    const limit = input.limit ?? 50;
    const { cursor } = input;

    const totalCount = await ctx.prisma.product.count();
    const items = await ctx.prisma.product.findMany({
      take: limit + 1, // get an extra item at the end which we'll use as next cursor
      cursor: cursor ? { id: cursor } : undefined,
      where: input.filter?.collectionSlug ? { collections: { some: { slug: input.filter.collectionSlug } } } : undefined,
      include: {
        name: true,
        gallery: true,
        fields: {
          include: {
            name: true,
            fieldValues: {
              include: {
                name: true,
              }
            }
          },
        }
      }
    });
    const nextCursor = items.length > limit ? items.pop()?.id : undefined;

    return {
      items,
      totalCount,
      nextCursor,
    };
  }),
});