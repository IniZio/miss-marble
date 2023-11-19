import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from '@trpc/server';
import { translationInputSchema, assetInputSchema } from './common';

export const productRouter = createTRPCRouter({
  create: publicProcedure.input(
    z.object({
      name: translationInputSchema,
      gallery: z.array(assetInputSchema),
      fields: z.array(z.object({
        fieldId: z.string(),
        required: z.boolean().default(false),
      })),
    }),
  ).mutation(async ({ input, ctx }) => {
    const product = await ctx.prisma.product.create({
      data: {
        name: {
          create: input.name
        },
        gallery: {
          connect: input.gallery.map((asset) => ({
            id: asset.id,
          })),
        },
        fields: {
          create: input.fields.map(({ fieldId, required }) => ({
            field: {
              connect: {
                id: fieldId,
              },
            },
            required,
          })),
        },
      },
      include: {
        name: true,
        gallery: true,
        fields: {
          include: {
            field: {
              include: {
                name: true,
                fieldOptions: {
                  include: {
                    name: true,
                  }
                }
              }
            }
          },
        }
      }
    });

    return product;
  }),
  update : publicProcedure.input(
    z.object({
      id: z.string(),
      name: translationInputSchema,
      gallery: z.array(assetInputSchema),
      fields: z.array(z.object({
        fieldId: z.string(),
        required: z.boolean().default(false),
      })),
    }),
  ).mutation(async ({ input, ctx }) => {
    const product = await ctx.prisma.product.update({
      where: { id: input.id },
      data: {
        name: {
          update: input.name
        },
        gallery: {
          deleteMany: {
            id: {
              notIn: input.gallery.map((asset) => asset.id),
            }
          },
          connect: input.gallery.map((asset) => ({
            id: asset.id,
          })),
        },
        fields: {
          upsert: input.fields.map(({ fieldId, required }) => ({
            where: {
              productId_fieldId: {
                fieldId,
                productId: input.id,
              },
            },
            create: {
              field: {
                connect: {
                  id: fieldId,
                },
              },
              required,
            },
            update: {
              required,
            },
          })),
        },
      },
      include: {
        name: true,
        gallery: true,
        fields: {
          include: {
            field: {
              include: {
                name: true,
                fieldOptions: {
                  include: {
                    name: true,
                  }
                }
              }
            }
          },
        }
      }
    });

    return product;
  }),
  detail: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const product = await ctx.prisma.product.findUnique({
      where: { id: input },
      include: {
        name: true,
        gallery: true,
        fields: {
          include: {
            field: {
              include: {
                name: true,
                fieldOptions: {
                  include: {
                    name: true,
                  }
                }
              }
            }
          },
        }
      }
    });

    if (!product) {
      throw new TRPCError({
        code: 'NOT_FOUND',
      });
    }

    return product;
  }),
  paginate: publicProcedure.input(
    z.object({
      pageIndex: z.number().min(0).nullish(),
      pageSize: z.number().min(1).max(100).nullish(),
    }),
  ).query(async ({ input, ctx }) => {
    const pageIndex = input.pageIndex ?? 0;
    const pageSize = input.pageSize ?? 10;

    const totalCount = await ctx.prisma.product.count();
    const pageCount = Math.ceil(totalCount / pageSize);
    const items = await ctx.prisma.product.findMany({
      skip: pageIndex * pageSize,
      take: pageSize, // get an extra item at the end which we'll use as next cursor
      include: {
        name: true,
        gallery: true,
        fields: {
          include: {
            field: {
              include: {
                name: true,
                fieldOptions: {
                  include: {
                    name: true,
                  }
                }
              }
            }
          },
        }
      }
    });

    return {
      items,
      pageCount,
      totalCount,
    };
  }),
  delete: publicProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
    await ctx.prisma.product.delete({
      where: { id: input },
    });

    return true;
  }),
});
