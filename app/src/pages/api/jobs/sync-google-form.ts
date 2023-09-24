/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { GOOGLE_FORM_ORDER_FIELDS } from '@/constants';
import googleSheet from '@/server/api/integrations/google-sheet';
import { cartRouter } from '@/server/api/routers/cart';
import { prisma } from '@/server/db'
import { addHours, addYears, isBefore, isValid, parse } from 'date-fns';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import type { NextApiRequest, NextApiResponse } from 'next'

dayjs.extend(customParseFormat)
dayjs.extend(timezone)

type ResponseData = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const shippingOptions = await prisma.shippingOption.findMany({ include: { name: true } });
  // @ts-expect-error Assume have zh name
  const delivery = shippingOptions.find((option) => option.name.text?.zh_Hant_HK?.includes('送上門'));
    // @ts-expect-error Assume have zh name
  const pickup = shippingOptions.find((option) => option.name.text?.zh_Hant_HK?.includes('門市'));

  const fields = GOOGLE_FORM_ORDER_FIELDS;

  function getField<T>(record: unknown[], key: keyof typeof fields): T {
    const field: number | number[] = fields[key] as number | number[];
    const convertValue = (value?: unknown): unknown => {
      switch(key) {
        case 'paid':
          return value === 'TRUE' ? 'CAPTURED' : 'AWAITING';
        case 'created_at':
          value = parse(value as string, 'M/d/y H:mm:ss', new Date());
          if (!isValid(value)) {
            value = undefined;
            value = new Date();
          }
          return value;
        case 'date':
          const createdAt = getField<Date>(record, 'created_at');
          value = parse(`${value as string} ${getField<string>(record, 'time').replace(':', '').slice(0, 4)}+08`, 'M/d HmmX', createdAt ? new Date(createdAt) : new Date());
          if (!isValid(value)) {
            return undefined;
          }

          if(isBefore(value as Date, createdAt)) {
            value = addYears(value as Date, 1);
          }
          // value = addHours(value, 8);
          return value;
        case 'decorations':
        case 'toppings':
          return ((value || '') as string).split(', ').filter(Boolean).join(', ');
        default:
          return ((value || '') as string).trim();
        }
    }

    if (Array.isArray(field)) {
      return field.map(f => record[f]).map(convertValue).filter(Boolean).join(', ') as T;
    }
    return convertValue(record[field]) as T;
  }

  function getExternalId(record: unknown[]): string {
    return `${getField<Date>(record, 'created_at').toISOString()}/${getField<string>(record, 'phone')}`;
  }

  console.log('[Sync Google Form]: Starting to sync...')
  const productFields = await prisma.productField.findMany({});
  // const getProductFieldByAlias = (alias: string) => productFields.find((field) => field.alias === alias);

  const records = await googleSheet.getAllRows()

  await prisma.order.deleteMany({
    where: {
      externalId: {
        not: {
          equals: null,
        }
      },
    },
  });
  await Promise.allSettled(records.map(r => prisma.order.upsert({
    where: {
      externalId: getExternalId(r),
    },
    create: {
      paymentStatus: getField<string>(r, 'paid'),
      externalId: getExternalId(r),
      currency: {
        connect: {
          code: 'hkd',
        },
      },
      subtotal: 0,
      discountTotal: 0,
      shippingTotal: 0,
      total: 0,
      shippingAddress: {
        create: {
          name: getField<string>(r, 'name'),
          address1: getField<string>(r, 'delivery_address') ?? '',
          address2: '',
        },
      },
      shippingOption: {
        connect: {
          id: getField<string>(r, 'delivery_method')?.includes('送上門') ? delivery?.id : pickup?.id,
        },
      },
      deliveryDate: getField<Date>(r, 'date'),
      name: getField<string>(r, 'name'),
      phoneNumber: getField<string>(r, 'phone'),
      socialChannel: getField<string>(r, 'order_from'),
      socialHandle: getField<string>(r, 'social_name'),
      remark: getField<string>(r, 'remarks'),
      items: {
        create: {
          productFieldValues: {
            create: productFields.map((field) => ({
              field: {
                connect: {
                  id: field.id,
                },
              },
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
              fieldValue: getField<string>(r, field.alias as any),
            })),
          },
          quantity: 1,
          subtotal: 0,
          shippingTotal: 0,
          total: 0,
        },
      }
    },
    update: {
      currency: {
        connect: {
          code: 'hkd',
        },
      },
      subtotal: 0,
      discountTotal: 0,
      shippingTotal: 0,
      total: 0,
      shippingAddress: {
        create: {
          name: getField<string>(r, 'name'),
          address1: getField<string>(r, 'delivery_address') ?? '',
          address2: '',
        },
      },
      shippingOption: {
        connect: {
          id: getField<string>(r, 'delivery_method')?.includes('送上門') ? delivery?.id : pickup?.id,
        },
      },
      deliveryDate: getField<Date>(r, 'date'),
      name: getField<string>(r, 'name'),
      phoneNumber: getField<string>(r, 'phone'),
      socialChannel: getField<string>(r, 'order_from'),
      socialHandle: getField<string>(r, 'social_name'),
      remark: getField<string>(r, 'remarks'),
      // items: {
      //   upsert: productFields.map((field) => ({
      //     where: {
      //       productFieldValues: {
      //         some: {
      //           field: {
      //             alias: field.alias,
      //           },
      //         },
      //       },
      //     },
      //     create: {
      //       productFieldValues: {
      //         create: productFields.map((field) => ({
      //           field: {
      //             connect: {
      //               id: field.id,
      //             },
      //           },
      //           // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
      //           fieldValue: getField<string>(r, field.alias as any),
      //         })),
      //       },
      //       quantity: 1,
      //       subtotal: 0,
      //       shippingTotal: 0,
      //       total: 0,
      //     },
      //     update: {
      //       productFieldValues: {
      //         upsert: {
      //           where: {
      //             field: {
      //               alias: field.alias,
      //             },
      //           },
      //           create: {
      //             field: {
      //               connect: {
      //                 id: field.id,
      //               },
      //             },
      //             // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
      //             fieldValue: getField<string>(r, field.alias as any),
      //           },
      //           update: {
      //             // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
      //             fieldValue: getField<string>(r, field.alias as any),
      //           },
      //         },
      //       },
      //     },
      //   })),
      // },
    }
  })));

  res.status(200).json({ message: 'Hello from Next.js!' })
}