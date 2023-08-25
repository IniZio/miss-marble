import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { prisma } from '@/server/db';

const createCartSchema = z.object({
  currencyCode: z.string(),
  items: z.array(z.object({
    productId: z.string(),
    productVariantId: z.string().nullish(),
    quantity: z.number(),
  })),
});

export const cartRouter = createTRPCRouter({
  create: publicProcedure
    .input(createCartSchema)
    .mutation(async ({ input }) => {
      const currencyCode = input.currencyCode;

      const products = await prisma.product.findMany({
        where: {
          id: {
            in: input.items.map(item => item.productId),
          },
        },
        include: {
          prices: true,
          variants: {
            include: {
              prices: true,
            },
            where: {
              id: {
                in: input.items.map(item => item.productVariantId).filter((item): item is string => !!item),
              },
            },
          },
        },
      });

      const lineItems = input.items.map(item => {
        const product = products.find(product => product.id === item.productId);
        const variant = product?.variants?.find(variant => variant.id === item.productVariantId);
        const price = variant?.prices?.find(price => price.currencyCode === currencyCode) ?? product?.prices?.find(price => price.currencyCode === currencyCode);

        const subtotal = price?.amount ?? 0;
        const shippingTotal = 0;
        const total = subtotal + shippingTotal;

        return {
          product: {
            connect: {
              id: item.productId,
            },
          },
          productVariant: item.productVariantId ? {
            connect: {
              id: item.productVariantId,
            },
          } : undefined,
          quantity: item.quantity,
          subtotal,
          shippingTotal,
          total,
        };
      });

      const subtotal = lineItems.reduce((acc, item) => acc + item.subtotal, 0);
      const shippingTotal = lineItems.reduce((acc, item) => acc + item.shippingTotal, 0);
      const total = lineItems.reduce((acc, item) => acc + item.total, 0);

      const cart = await prisma.cart.create({
        data: {
          items: {
            create: lineItems,
          },
          currencyCode,
          subtotal,
          discountTotal: 0,
          shippingTotal,
          total,
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
            },
          },
          billingAddress: true,
          shippingAddress: true,
        },
      });

      return cart;
    }),
    get: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        const cart = await prisma.cart.findUnique({
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
              },
            },
            billingAddress: true,
            shippingAddress: true,
          },
        });

        return cart;
      }),
    delete: publicProcedure
      .input(z.string())
      .mutation(async ({ input }) => {
        const cart = await prisma.cart.delete({
          where: {
            id: input,
          },
        });

        return cart;
      }),
});
