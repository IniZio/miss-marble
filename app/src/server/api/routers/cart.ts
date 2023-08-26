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
    addLineItem: publicProcedure
      .input(z.object({
        cartId: z.string(),
        item: z.object({
          productId: z.string(),
          productVariantId: z.string().nullish(),
          quantity: z.number(),
        })
      }))
      .mutation(async ({ input }) => {
        const cart = await prisma.cart.findUnique({
          where: {
            id: input.cartId,
          },
          include: {
            items: true,
          },
        });

        if (!cart) {
          throw new Error('Cart not found');
        }

        const item = input.item;
        const product = await prisma.product.findUnique({
          where: {
            id: item.productId,
          },
          include: {
            prices: true,
            variants: {
              include: {
                prices: true,
              },
              where: item.productVariantId ? {
                id: item.productVariantId,
              } : undefined,
            },
          },
        });

        if (!product) {
          throw new Error('Product not found');
        }

        const variant = product?.variants?.find(variant => variant.id === item.productVariantId);
        const price = variant?.prices?.find(price => price.currencyCode === cart.currencyCode) ?? product?.prices?.find(price => price.currencyCode === cart.currencyCode);

        const subtotal = price?.amount ?? 0;
        const shippingTotal = 0;
        const total = subtotal + shippingTotal;

        await prisma.lineItem.create({
          data: {
            cart: {
              connect: {
                id: input.cartId,
              },
            },
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
          },
        });

        return prisma.cart.findUnique({
          where: {
            id: input.cartId,
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
      }),
    removeLineItem: publicProcedure
      .input(z.object({
        cartId: z.string(),
        lineItemId: z.string(),
      }))
      .mutation(async ({ input }) => {
        const cart = await prisma.cart.findUnique({
          where: {
            id: input.cartId,
          },
          include: {
            items: true,
          },
        });

        if (!cart) {
          throw new Error('Cart not found');
        }

        if (cart.items.length <= 1) {
          await prisma.cart.delete({
            where: {
              id: input.cartId,
            },
          });

          return null;
        }

        await prisma.lineItem.delete({
          where: {
            id: input.lineItemId,
          },
        });

        return prisma.cart.findUnique({
          where: {
            id: input.cartId,
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
