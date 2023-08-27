import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { prisma } from '@/server/db';
import { type Prisma } from '@prisma/client';

const lineItemInputSchema = z.object({
  productId: z.string(),
  productFieldValues: z.array(z.object({
    fieldId: z.string(),
    fieldOptionId: z.string().nullish(),
    asset: z.object({
      id: z.string(),
    }).nullish(),
    value: z.string().nullish(),
  })),
  quantity: z.number(),
});

type LineItemInput = z.infer<typeof lineItemInputSchema>;

const createCartSchema = z.object({
  currencyCode: z.string(),
  items: z.array(lineItemInputSchema),
});

async function constructLineItem(inputs: LineItemInput[], currencyCode: string) {
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: inputs.map(item => item.productId),
      },
    },
    include: {
      prices: true,
      fields: {
        include: {
          field: {
            include: {
              name: true,
              prices: true,
              fieldOptions: {
                include: {
                  prices: true,
                }
              },
            },
          },
        },
      },
      variants: {
        include: {
          prices: true,
          fieldOptions: {
            include: {
              prices: true,
            }
          },
        },
      },
    },
  });

  const lineItems = inputs.map((item) => {
    const product = products.find(product => product.id === item.productId);
    const variant = product?.variants?.find(variant => variant.fieldOptions.every(option => item.productFieldValues.some(value => value.fieldId === option.fieldId && value.fieldOptionId === option.id)));
    const variantPrice = variant?.prices?.find(price => price.currencyCode === currencyCode) ?? product?.prices?.find(price => price.currencyCode === currencyCode);

    const optionPrices = product?.fields?.flatMap(field =>
      field.field.fieldOptions.filter(option => item.productFieldValues
        .some(value => value.fieldId === option.fieldId && value.fieldOptionId === option.id))
        .map(option => ({
          fieldId: field.field.id,
          fieldOptionId: option.id,
          price: option.prices.find(price => price.currencyCode === currencyCode),
        }))
    ) ?? [];

    const subtotal = variantPrice?.amount ?? 0 + optionPrices.reduce((acc, option) => acc + (option.price?.amount ?? 0), 0);
    const shippingTotal = 0;
    const total = subtotal + shippingTotal;

    return {
      product: {
        connect: {
          id: item.productId,
        },
      },
      productVariant: variant ? {
        connect: {
          id: variant.id,
        },
      } : undefined,
      productFieldValues: {
        createMany: {
          data: item.productFieldValues.map(value => ({
            fieldId: value.fieldId,
            fieldOptionId: value.fieldOptionId,
            fieldOptionAssetId: value.asset?.id,
            fieldValue: value.value,
          })) satisfies Prisma.CartProductFieldValueCreateManyLineItemInput[],
        },
      },
      quantity: item.quantity,
      subtotal,
      shippingTotal,
      total,
    };
  });

  return lineItems;
}

async function queryCart(cartId: string) {
  return prisma.cart.findUniqueOrThrow({
    where: {
      id: cartId,
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
    },
  });
}

async function recalculateCart(cartId : string) {
  const cart = await queryCart(cartId);

  if (!cart) {
    throw new Error('Cart not found');
  }

  const lineItems = cart.items;
  const subtotal = lineItems.reduce((acc, item) => acc + item.subtotal, 0);
  const shippingTotal = lineItems.reduce((acc, item) => acc + item.shippingTotal, 0);
  const total = lineItems.reduce((acc, item) => acc + item.total, 0);

  await prisma.cart.update({
    where: {
      id: cartId,
    },
    data: {
      subtotal,
      shippingTotal,
      total,
    },
  });

  return queryCart(cartId);
}

export const cartRouter = createTRPCRouter({
  create: publicProcedure
    .input(createCartSchema)
    .mutation(async ({ input }) => {
      const currencyCode = input.currencyCode;

      const lineItems = await constructLineItem(input.items, currencyCode);
      const cart = await prisma.cart.create({
        data: {
          items: {
            create: lineItems,
          },
          currencyCode,
          subtotal: 0,
          discountTotal: 0,
          shippingTotal: 0,
          total: 0,
        },
      });

      return recalculateCart(cart.id);
    }),
    get: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        const cart = await queryCart(input);

        return cart;
      }),
    addLineItem: publicProcedure
      .input(z.object({
        cartId: z.string(),
        item: lineItemInputSchema
      }))
      .mutation(async ({ input }) => {
        const cart = await queryCart(input.cartId);
        if (!cart) {
          throw new Error('Cart not found');
        }

        await prisma.cart.update({
          where: {
            id: input.cartId,
          },
          data: {
            items: {
              create: await constructLineItem([input.item], cart.currencyCode),
              connect: cart.items.map(item => ({
                id: item.id,
              })),
            },
          },
        });

        return recalculateCart(input.cartId);
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

        await prisma.cartProductFieldValue.deleteMany({
          where: {
            lineItemId: input.lineItemId,
          },
        });
        await prisma.lineItem.delete({
          where: {
            id: input.lineItemId,
          },
        });

        return recalculateCart(input.cartId);
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
