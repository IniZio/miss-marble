import cron from "node-cron";

/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { GOOGLE_FORM_ORDER_FIELDS } from "./constants";
import googleSheet from "./integrations/google-sheet";
import {
  addHours,
  addYears,
  differenceInDays,
  differenceInMonths,
  isAfter,
  isBefore,
  isValid,
  parse,
} from "date-fns";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";
import { PrismaClient } from "@prisma/client";
import { prisma } from "./db";

dayjs.extend(customParseFormat);
dayjs.extend(timezone);

let lastSyncedAt: Date | undefined;
let isSyncing = false;

export const syncGoogleOrder = async () => {
  if (isSyncing) {
    return;
  }
  isSyncing = true;

  try {
    const shippingOptions = await prisma.shippingOption.findMany({
      include: { name: true },
    });
    // @ts-expect-error Assume have zh name
    const delivery = shippingOptions.find((option) =>
      option.name.text?.zh_Hant_HK?.includes("送上門"),
    );
    // @ts-expect-error Assume have zh name
    const pickup = shippingOptions.find((option) =>
      option.name.text?.zh_Hant_HK?.includes("門市"),
    );

    const fields = GOOGLE_FORM_ORDER_FIELDS;

    function getField<T>(record: unknown[], key: keyof typeof fields): T {
      const field: number | number[] = fields[key] as number | number[];
      const convertValue = (value?: unknown): unknown => {
        switch (key) {
          case "paid":
            return value === "TRUE" ? "CAPTURED" : "PENDING";
          case "created_at":
            value = parse(
              `${value as string}+08`,
              "M/d/y H:mm:ssX",
              new Date(),
            );
            if (!isValid(value)) {
              value = undefined;
            }
            return value;
          case "printed":
            return value === "TRUE" ? true : false;
          case "date":
            const createdAt = getField<Date | undefined>(record, "created_at");
            value = parse(
              `${value as string} ${getField<string>(record, "time").replace(":", "").slice(0, 4)}+08`,
              "M/d HmmX",
              createdAt ? new Date(createdAt) : new Date(),
            );
            if (!isValid(value)) {
              return undefined;
            }

            if (createdAt && isBefore(value as Date, createdAt)) {
              value = addYears(value as Date, 1);
            }
            // value = addHours(value, 8);
            return value;
          case "toppings":
            return ((value || "") as string)
              .split(", ")
              .filter(Boolean)
              .join(", ");
          case "paid_sentence":
            return ((value || "") as string)
              .replace(/寫字朱古力牌[^,|，]*(,|，)/, "")
              .trim();
          default:
            return ((value || "") as string).trim();
        }
      };

      if (Array.isArray(field)) {
        return field
          .map((f) => record[f])
          .map(convertValue)
          .filter(Boolean)
          .join(", ") as T;
      }
      return convertValue(record[field]) as T;
    }

    function getExternalId(record: unknown[]): string {
      return getField<string>(record, "index");
    }

    console.log("[Sync Google Order]: Starting to sync...");
    const productFields = await prisma.productField.findMany({
      where: { remark: "google-form" },
    });

    const records = (await googleSheet.getAllRows()).reverse();

    const existingOrders = await prisma.order.findMany({
      select: {
        id: true,
        externalId: true,
      },
      where: {
        externalId: {
          not: {
            equals: null,
          },
        },
      },
    });
    const existingExternalIdsSet = new Set(
      existingOrders.map((order) => order.externalId!),
    );

    let count = 0;
    let createCount = 0,
      updateCount = 0,
      skipCount = 0,
      deleteCount = 0,
      errorCount = 0;

    const now = new Date();
    for (const r of records) {
      count++;

      if (
        !getField<Date | undefined>(r, "date") ||
        (getField<Date>(r, "date") < now &&
          differenceInMonths(getField<Date>(r, "date"), now) >= 1)
      ) {
        console.log(
          `[Sync Google Order]: Syncing ${count}/${records.length}... skipping`,
        );
        skipCount++;
        continue;
      }

      try {
        existingExternalIdsSet.delete(getExternalId(r));
        const externalData = JSON.stringify(r);

        const existing = await prisma.order.findUnique({
          where: {
            externalId: getExternalId(r),
          },
        });
        const shouldUpdate = existing && existing.externalData !== externalData;

        console.log(
          `[Sync Google Order]: Syncing ${count}/${records.length}... ${shouldUpdate ? "updating" : existing ? "skipping" : "creating"}`,
        );

        if (existing) {
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

        const printed = getField<boolean>(r, "printed");
        const fulfillmentStatus = printed ? "SCHEDULED" : "PENDING";

        await prisma.order.upsert({
          where: {
            externalId: getExternalId(r),
          },
          create: {
            externalData,
            createdAt:
              getField<Date | undefined>(r, "created_at") ?? new Date(),
            paymentStatus: getField<string>(r, "paid"),
            fulfillmentStatus,
            externalId: getExternalId(r),
            currency: {
              connect: {
                code: "hkd",
              },
            },
            subtotal: 0,
            discountTotal: 0,
            shippingTotal: 0,
            total: 0,
            shippingAddress: {
              create: {
                name: getField<string>(r, "name"),
                address1: getField<string>(r, "delivery_address") ?? "",
                address2: getField<string>(r, "delivery_time") ?? "",
              },
            },
            shippingOption: {
              connect: {
                id: getField<string>(r, "delivery_method")?.includes("自取")
                  ? pickup?.id
                  : delivery?.id,
              },
            },
            deliveryDate: getField<Date>(r, "date"),
            name: getField<string>(r, "name"),
            phoneNumber: getField<string>(r, "phone"),
            socialChannel: getField<string>(r, "order_from"),
            socialHandle: getField<string>(r, "social_name"),
            remark: getField<string>(r, "remarks"),
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
            },
          },
          update: {
            externalData,
            createdAt:
              getField<Date | undefined>(r, "created_at") ?? new Date(),
            paymentStatus: getField<string>(r, "paid"),
            fulfillmentStatus,
            externalId: getExternalId(r),
            currency: {
              connect: {
                code: "hkd",
              },
            },
            subtotal: 0,
            discountTotal: 0,
            shippingTotal: 0,
            total: 0,
            shippingAddress: {
              update: {
                name: getField<string>(r, "name"),
                address1: getField<string>(r, "delivery_address") ?? "",
                address2: "",
              },
            },
            shippingOption: {
              connect: {
                id: getField<string>(r, "delivery_method")?.includes("自取")
                  ? pickup?.id
                  : delivery?.id,
              },
            },
            deliveryDate: getField<Date>(r, "date"),
            name: getField<string>(r, "name"),
            phoneNumber: getField<string>(r, "phone"),
            socialChannel: getField<string>(r, "order_from"),
            socialHandle: getField<string>(r, "social_name"),
            remark: getField<string>(r, "remarks"),
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
            },
          },
        });
      } catch (e) {
        console.error(e);
        errorCount++;
      }
    }

    for (const externalId of existingExternalIdsSet) {
      try {
        await prisma.order.delete({
          where: {
            externalId,
          },
        });
        deleteCount++;
        console.log(`[Sync Google Order]: Deleting ${externalId}`);
      } catch (e) {
        if (e.code === "P2025") {
          continue;
        }

        console.error(e);
      }
    }

    console.log(
      `[Sync Google Order]: Finished syncing. ${createCount} added, ${updateCount} updated, ${skipCount} skipped, ${deleteCount} deleted.`,
    );
  } finally {
    lastSyncedAt = new Date();
    isSyncing = false;
  }
};

