import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from '@trpc/server';
import { assetInputSchema } from '../admin/common';

// Create router
export const inventoryRouter = createTRPCRouter({
  // // CRUD operations for stock locations
  // createStockLocation: publicProcedure.input(
  //   z.object({
  //     name: z.string(),
  //     address: z.string(),
  //   }),
  // ).query(async ({ input, ctx }) => {
  //   const stockLocation = await ctx.prisma.stockLocation.create({
  //     data: input,
  //   });
  //   return stockLocation;
  // }),

  // getStockLocation: publicProcedure.input(
  //   z.object({
  //     id: z.number(),
  //   }),
  // ).query(async ({ input, ctx }) => {
  //   const stockLocation = await ctx.prisma.stockLocation.findUnique({
  //     where: {
  //       id: input.id,
  //     },
  //   });
  //   if (!stockLocation) {
  //     throw new TRPCError({
  //       code: "NOT_FOUND",
  //       message: "Stock location not found",
  //     });
  //   }
  //   return stockLocation;
  // }),

  // updateStockLocation: publicProcedure.input(
  //   z.object({
  //     id: z.number(),
  //     name: z.string().optional(),
  //     address: z.string().optional(),
  //   }),
  // ).query(async ({ input, ctx }) => {
  //   const stockLocation = await ctx.prisma.stockLocation.update({
  //     where: {
  //       id: input.id,
  //     },
  //     data: input,
  //   });
  //   return stockLocation;
  // }),

  // deleteStockLocation: publicProcedure.input(
  //   z.object({
  //     id: z.number(),
  //   }),
  // ).query(async ({ input, ctx }) => {
  //   const stockLocation = await ctx.prisma.stockLocation.delete({
  //     where: {
  //       id: input.id,
  //     },
  //   });
  //   return stockLocation;
  // }),

  // CRUD operations for inventory items
  // create: publicProcedure.input(
  //   z.object({
  //     sku: z.string(),
  //     categoryId: z.string(),
  //     thumbnail: assetInputSchema.optional(),
  //   }),
  // ).query(async ({ input, ctx }) => {
  //   const inventoryItem = await ctx.prisma.inventoryItem.create({
  //     data: {
  //       sku: input.sku,
  //       category: {
  //         connect: {
  //           id: input.categoryId,
  //         },
  //       },
  //       thumbnail: {
  //         connect: input.thumbnail,
  //       },
  //     },
  //   });
  //   return inventoryItem;
  // }),

  // getInventoryItem: publicProcedure.input(
  //   z.object({
  //     id: z.number(),
  //   }),
  // ).query(async ({ input, ctx }) => {
  //   const inventoryItem = await ctx.prisma.inventoryItem.findUnique({
  //     where: {
  //       id: input.id,
  //     },
  //     include: {
  //       product: true,
  //       stockLocation: true,
  //     },
  //   });
  //   if (!inventoryItem) {
  //     throw new TRPCError({
  //       code: "NOT_FOUND",
  //       message: "Inventory item not found",
  //     });
  //   }
  //   return inventoryItem;
  // }),

  update: publicProcedure.input(
    z.object({
      id: z.string(),
      categoryId: z.string(),
      thumbnail: assetInputSchema.optional(),
    }),
  ).query(async ({ input, ctx }) => {
    const inventoryItem = await ctx.prisma.inventoryItem.update({
      where: {
        id: input.id,
      },
      data: {
        category: {
          connect: {
            id: input.categoryId,
          },
        },
        thumbnail: {
          connect: input.thumbnail,
        },
      },
    });
    return inventoryItem;
  }),

  delete: publicProcedure.input(
    z.object({
      id: z.string(),
    }),
  ).query(async ({ input, ctx }) => {
    const inventoryItem = await ctx.prisma.inventoryItem.update({
      where: {
        id: input.id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
    return inventoryItem;
  }),

  // Method for updating inventory levels
  // updateInventoryLevel: publicProcedure.input(
  //   z.object({
  //     inventoryItemId: z.string(),
  //     stockLocationId: z.string(),
  //     name : z.string(),
  //     quantity: z.number(),
  //   }),
  // ).query(async ({ input, ctx }) => {
  //   if (input.quantity <= 0) {
  //     await ctx.prisma.inventoryLevel.delete({
  //       where: {
  //         id: undefined,
  //         inventoryItemId: input.inventoryItemId,
  //         stockLocationId: input.stockLocationId,
  //         name: input.name,
  //       },
  //     });
  //     return;
  //   }

  //   const inventoryItem = await ctx.prisma.inventoryLevel.upsert({
  //     where: {
  //       id: undefined,
  //       inventoryItemId: input.inventoryItemId,
  //       stockLocationId: input.stockLocationId,
  //       name: input.name,
  //     },
  //     create: {
  //       inventoryItem: {
  //         connect: {
  //           id: input.inventoryItemId,
  //         },
  //       },
  //       stockLocation: {
  //         connect: {
  //           id: input.stockLocationId,
  //         },
  //       },
  //       name: input.name,
  //       quantity: input.quantity,
  //     },
  //     update: {
  //       quantity: input.quantity,
  //     },
  //   });
  //   return inventoryItem;
  // }),

  // paginate: publicProcedure.input(
  //   z.object({
  //     pageIndex: z.number().min(0).nullish(),
  //     pageSize: z.number().min(1).max(100).nullish(),
  //   }),
  // ).query(async ({ input, ctx }) => {
  //   const pageIndex = input.pageIndex ?? 0;
  //   const pageSize = input.pageSize ?? 10;

  //   const totalCount = await ctx.prisma.product.count();
  //   const pageCount = Math.ceil(totalCount / pageSize);
  //   const items = await ctx.prisma.inventoryItem.findMany({
  //     skip: pageIndex * pageSize,
  //     take: pageSize, // get an extra item at the end which we'll use as next cursor
  //     include: {
  //       thumbnail: true,
  //       inventoryLevels: {
  //         include: {
  //           stockLocation: true,
  //         },
  //       }
  //     }
  //   });

  //   return {
  //     items,
  //     pageCount,
  //     totalCount,
  //   };
  // }),

  infinite: publicProcedure.input(
    z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(),
      keyword: z.string().nullish(),
    }),
  ).query(async ({ input, ctx }) => {
    const limit = input.limit ?? 50;
    const { cursor, keyword } = input;

    const totalCount = await ctx.prisma.inventoryItem.count();
    const items = await ctx.prisma.inventoryItem.findMany({
      take: limit + 1, // get an extra item at the end which we'll use as next cursor
      cursor: cursor ? { id: cursor } : undefined,
      where: keyword ? { OR: [{name: { contains: keyword, mode: 'insensitive' }}, { externalId: { contains: keyword, mode: 'insensitive' } }]  } : undefined,
      include: {
        thumbnail: true,
        inventoryLevels: {
          include: {
            stockLocation: true,
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
