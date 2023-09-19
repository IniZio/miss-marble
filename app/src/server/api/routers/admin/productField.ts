import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from '@trpc/server';
import { translationInputSchema } from './common';

export const productFieldRouter = createTRPCRouter({
  create: publicProcedure.input(
    z.object({
      name: translationInputSchema,
      alias: z.string(),
      type: z.nativeEnum({
        Text: 'TEXT',
        Select: 'SELECT',
        Checkboxes: 'CHECKBOXES',
        Asset: 'ASSET',
      }),
      fieldOptions: z.array(z.object({
        name: translationInputSchema,
      })),
    }),
  ).mutation(async ({ input, ctx }) => {
    const productField = await ctx.prisma.productField.create({
      data: {
        name: {
          create: input.name
        },
        type: input.type,
        alias: input.alias,
        fieldOptions: {
          create: input.fieldOptions.map(fieldOption => ({
            name: {
              create: fieldOption.name,
            }
          })),
        },
      },
      include: {
        name: true,
        fieldOptions: {
          include: {
            name: true,
          }
        }
      },
    });

    return productField;
  }),
  update: publicProcedure.input(
    z.object({
      id: z.string(),
      name: translationInputSchema,
      alias: z.string(),
      type: z.nativeEnum({
        Text: 'TEXT',
        Select: 'SELECT',
        Checkboxes: 'CHECKBOXES',
        Asset: 'ASSET',
      }),
      fieldOptions: z.array(z.object({
        id: z.string().optional(),
        name: translationInputSchema,
      })),
    }),
  ).mutation(async ({ input, ctx }) => {
    const productField = await ctx.prisma.productField.update({
      where: {
        id: input.id,
      },
      data: {
        name: {
          update: input.name,
        },
        type: input.type,
        alias: input.alias,
        fieldOptions: {
          create: input.fieldOptions.filter(fieldOption => !fieldOption.id).map(fieldOption => ({
            name: {
              create: fieldOption.name,
            }
          })),
          upsert: input.fieldOptions.filter(fieldOption => !!fieldOption.id).map(fieldOption => ({
            where: {
              id: fieldOption.id,
            },
            create: {
              name: {
                create: fieldOption.name,
              }
            },
            update: {
              name: {
                update: fieldOption.name,
              }
            },
          })),
          deleteMany: {
            id: {
              notIn: input.fieldOptions.map(fieldOption => fieldOption.id).filter(Boolean),
            },
          },
        },
      },
      include: {
        name: true,
        fieldOptions: {
          include: {
            name: true,
          }
        }
      },
    });

    // await ctx.prisma.productFieldOption.create({
    //   data: input.fieldOptions.map(fieldOption => ({
    //     name: {
    //       create: fieldOption.name,
    //     },
    //     productFieldId: productField.id,
    //   })),
    //   skipDuplicates: true,
    // });

    return productField;
  }),
  detail: publicProcedure.input(
    z.string(),
  ).query(async ({ input, ctx }) => {
    const productField = await ctx.prisma.productField.findUnique({
      where: {
        id: input,
      },
      include: {
        name: true,
        fieldOptions: {
          include: {
            name: true,
          }
        }
      },
    });

    if (!productField) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Product field not found',
      });
    }

    return productField;
  }),
  paginate: publicProcedure.input(
    z.object({
      pageIndex: z.number().min(0).nullish(),
      // FIXME: Set back to 100 after handled in admin product form
      pageSize: z.number().min(1).max(1000).nullish(),
    }),
  ).query(async ({ input, ctx }) => {
    const pageIndex = input.pageIndex ?? 0;
    const pageSize = input.pageSize ?? 10;

    const totalCount = await ctx.prisma.product.count();
    const pageCount = Math.ceil(totalCount / pageSize);
    const items = await ctx.prisma.productField.findMany({
      skip: pageIndex * pageSize,
      take: pageSize, // get an extra item at the end which we'll use as next cursor
      include: {
        name: true,
        // fieldOptions: {
        //   include: {
        //     name: true,
        //   }
        // }
      }
    });

    return {
      items,
      pageCount,
      totalCount,
    };
  }),
});
