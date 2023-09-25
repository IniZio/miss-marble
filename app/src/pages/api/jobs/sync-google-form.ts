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
        case 'paid_sentence':
          return ((value || '') as string).replace(/寫字朱古力牌[^,|，]*(,|，)/, '').trim();
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
  const productFields = await prisma.productField.findMany({ where: { remark: 'google-form' } });
  // const getProductFieldByAlias = (alias: string) => productFields.find((field) => field.alias === alias);

  const records = await googleSheet.getAllRows()

  const extenalOrders = await prisma.order.findMany({
    where: {
      externalId: {
        not: {
          equals: null,
        }
      },
    },
  });
  const externnalOrderByExternalId = extenalOrders.reduce((acc, order) => {
    if (!order.externalId) {
      return acc;
    }

    acc[order.externalId] = order;
    return acc;
  }, {} as Record<string, typeof extenalOrders[0]>);

  let createCount = 0, updateCount = 0, skipCount = 0, deleteCount = 0, errorCount = 0;
  try {
    const { count } = await prisma.order.deleteMany({
      where: {
        externalId: {
          not: {
            equals: null,
          },
          notIn: extenalOrders.map((order) => order.externalId).filter(Boolean),
        },
      },
    });
    deleteCount += count;
  } catch (e) {
    console.error(e);
  }

  // await prisma.$transaction(async (tx) => {
    for (const r of records) {
      if (!getField<string>(r, 'date')) {
        continue;
      }

      try {
        const externalData = JSON.stringify(r);

        const existing = externnalOrderByExternalId[getExternalId(r)];

        if (existing) {
          const shouldUpdate = existing.externalData !== externalData;
          if (!shouldUpdate) {
            skipCount++;
            continue;
          }


          updateCount++;
          await prisma.cartProductFieldValue.deleteMany({
            where: {
              lineItem: {
                orderId: existing.id,
              },
            },
          });
        } else {
          createCount++;
        }

        await prisma.order.upsert({
          where: {
            externalId: getExternalId(r),
          },
          create: {
            externalData,
            createdAt: getField<Date>(r, 'created_at'),
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
                id: getField<string>(r, 'delivery_method')?.includes('自取') ? pickup?.id : delivery?.id,
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
            externalData,
            createdAt: getField<Date>(r, 'created_at'),
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
              update: {
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
        });
      } catch (e) {
        console.error(e);
        errorCount++;
      }
    }
  // });

  console.log(`[Sync Google Form]: Finished syncing. ${createCount} added, ${updateCount} updated, ${skipCount} skipped, ${deleteCount} deleted.`)
  res.status(200).json({ message: `[Sync Google Form]: Finished syncing. ${createCount} added, ${updateCount} updated, ${skipCount} skipped, ${deleteCount} deleted.` })
}