import { z } from "zod";
import day from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { prisma } from '@/server/db';
import { type Prisma } from '@prisma/client';
import { type JsonObject } from '@prisma/client/runtime/library';
import googlesheet from '../integrations/google-sheet';
import { TRPCError } from '@trpc/server';
import { GOOGLE_FORM_ORDER_FIELDS } from '@/constants';

day.extend(utc);
day.extend(timezone);

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
  const cart = await prisma.cart.findUnique({
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
      shippingOption: {
        include: {
          name: true,
        }
      },
    },
  });

  if  (!cart) {
    throw new TRPCError({
      code: 'NOT_FOUND',
    });
  }

  return cart;
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

    update: publicProcedure
      .input(z.object({
        cartId: z.string(),
        name: z.string(),
        phoneNumber: z.string(),
        socialChannel: z.string(),
        socialHandle: z.string(),
        remark: z.string(),
        shippingAddress: z.object({
          name: z.string(),
          address1: z.string(),
          address2: z.string(),
        }),
        shippingOptionId: z.string(),
        paymentOptionId: z.string(),
        deliveryDate: z.date(),
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
            phoneNumber: input.phoneNumber,
            socialChannel: input.socialChannel,
            socialHandle: input.socialHandle,
            remark: input.remark,
            name: input.name,
            shippingAddress: {
              upsert: {
                update: {
                  name: input.shippingAddress.name,
                  address1: input.shippingAddress.address1,
                  address2: input.shippingAddress.address2,
                },
                create: {
                  name: input.shippingAddress.name,
                  address1: input.shippingAddress.address1,
                  address2: input.shippingAddress.address2,
                },
                where: {
                  id: cart.shippingAddress?.id,
                },
              },
            },
            shippingOption: {
              connect: {
                id: input.shippingOptionId,
              },
            },
            deliveryDate: input.deliveryDate,
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

    complete: publicProcedure
      .input(z.string())
      .mutation(async ({ input }) => {
        const cart = await queryCart(input);

        const fields = GOOGLE_FORM_ORDER_FIELDS;

        const getFieldValueString = (item: typeof cart.items[0], alias: string): string => {
          const fieldValues = item.productFieldValues.filter(i => i.field.alias === alias);

          return fieldValues
            .map((value) => {
              return (
                value.fieldOptionAsset?.url ??
                (value.fieldOption?.name.text as JsonObject)?.zh_Hant_HK ??
                value.fieldValue
              );
            })
            .join(", ");
        }

        const googleSheetOrders: Record<keyof typeof fields, string>[] = cart.items.map(item => ({
          paid: "FALSE",
          created_at: day().tz("Asia/Hong_Kong").format('M/D/YYYY H:mm:ss'),
          name: cart.shippingAddress?.name,
          phone: cart.phoneNumber,
          date: day(cart.deliveryDate).tz("Asia/Hong_Kong").format('\'M/D'),
          time: day(cart.deliveryDate).tz("Asia/Hong_Kong").format('Hmm') + '-' + day(cart.deliveryDate).add(1, 'hour').tz("Asia/Hong_Kong").add(1, 'hour').format('Hmm'),
          cake: (item.product?.name.text as JsonObject).zh_Hant_HK,
          letter: getFieldValueString(item, 'letter'),
          taste: getFieldValueString(item, 'taste'),
          inner_taste: getFieldValueString(item, 'inner_taste'),
          bottom_taste: getFieldValueString(item, 'bottom_taste'),
          size: getFieldValueString(item, 'size'),
          shape: getFieldValueString(item, 'shape'),
          color: getFieldValueString(item, 'color'),
          sentence: getFieldValueString(item, 'sentence'),
          paid_sentence: getFieldValueString(item, 'paid_sentence'),
          toppings: getFieldValueString(item, 'toppings'),
          decorations: getFieldValueString(item, 'decorations'),
          social_name: cart.socialHandle,
          order_from: cart.socialChannel,
          delivery_method: (cart.shippingOption?.name.text as JsonObject)?.zh_Hant_HK ?? '',
          delivery_address: (cart.shippingAddress?.address1 ?? '') + (cart.shippingAddress?.address2 ?? ''),
          remarks: cart.remark,
        }) as Record<keyof typeof fields, string>);

        const row: string[] = [];
        for (const googleSheetOrder of googleSheetOrders) {
          Object.entries(fields).forEach(([field, columns]) => {
            // @ts-expect-error ???
            row[Array.isArray(columns) ? columns[0]! : columns] = googleSheetOrder[field as keyof typeof fields];
          })
          await googlesheet.insertRow(row);
        }

        const createdAt = new Date();
        await prisma.order.create({
          data: {
            externalId: `${createdAt.toISOString()}/${cart.phoneNumber}`,
            externalData: JSON.stringify(row),
            createdAt,
            cart: {
              connect: {
                id: input,
              },
            },
            currency: {
              connect: {
                code: cart.currencyCode,
              },
            },
            subtotal: cart.subtotal,
            discountTotal: cart.discountTotal,
            shippingTotal: cart.shippingTotal,
            total: cart.total,
            billingAddress: cart.billingAddress?.id ? {
              connect: {
                id: cart.billingAddress?.id,
              }
            } : undefined,
            shippingAddress: {
              connect: {
                id: cart.shippingAddress!.id,
              }
            },
            shippingOption: {
              connect: {
                id: cart.shippingOption!.id,
              },
            },
            deliveryDate: cart.deliveryDate!,
            paymentStatus: 'AWAITING',
            name: cart.name!,
            phoneNumber: cart.phoneNumber,
            socialChannel: cart.socialChannel,
            socialHandle: cart.socialHandle,
            remark: cart.remark,
            items: {
              connect: cart.items.map(item => ({
                id: item.id,
              })),
            },
          },
        });
      }),
});
