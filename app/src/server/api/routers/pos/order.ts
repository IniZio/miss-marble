import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from '@trpc/server';
import { type PrismaClient } from '@prisma/client';

export function findOrders(ctx: {prisma: PrismaClient}, input: {
  dateStart: Date,
  dateEnd: Date,
  keyword?: string,
}) {
  return ctx.prisma.order.findMany({
    orderBy: {
      deliveryDate: 'asc',
    },
    where: {
      deliveryDate: {
        gte: input.dateStart,
        lte: input.dateEnd,
      },
      OR: [
        {
          phoneNumber: {
            contains: input.keyword,
            mode: 'insensitive'
          },
        },
        {
          name: {
            contains: input.keyword,
            mode: 'insensitive'
          },
        },
        {
          socialHandle: {
            contains: input.keyword,
            mode: 'insensitive',
          },
        },
        // {
        //   shippingAddress: {
        //     name: {
        //       contains: input.keyword,
        //       mode: 'insensitive',
        //     }
        //   },
        //   billingAddress: {
        //     name: {
        //       contains: input.keyword,
        //       mode: 'insensitive',
        //     }
        //   },
        // },
      ],
    },
    include: {
      currency: true,
      items: {
        include: {
          product: {
            include: {
              name: true,
              gallery: true,
            },
          },
          productFieldValues: {
            include: {
              field: {
                include: {
                  name: true,
                }
              },
              fieldOption: {
                include: {
                  name: true,
                }
              },
              fieldOptionAsset: true,
            }
          },
        },
      },
      billingAddress: true,
      shippingAddress: true,
      shippingOption: {
        include: {
          name: true,
          price: true,
        }
      },
    },
  });
}

export const orderRouter = createTRPCRouter({
  detail: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const item = await ctx.prisma.order.findUnique({
      where: {
        id: input,
      },
      include: {
        currency: true,
        items: {
          include: {
            product: {
              include: {
                name: true,
                gallery: true,
              },
            },
            productFieldValues: {
              include: {
                field: {
                  include: {
                    name: true,
                  }
                },
                fieldOption: {
                  include: {
                    name: true,
                  }
                },
                fieldOptionAsset: true,
              }
            },
          },
        },
        billingAddress: true,
        shippingAddress: true,
        shippingOption: {
          include: {
            name: true,
            price: true,
          }
        },
      },
    });

    if (!item) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Order not found',
      });
    }

    return item;
  }),
  list: publicProcedure.input(
    z.object({
      dateStart: z.date(),
      dateEnd: z.date(),
      keyword: z.string().default(''),
    }),
  ).query(async ({ input, ctx }) => {
    const items = await findOrders(ctx, input);

    return items;
  }),
});
