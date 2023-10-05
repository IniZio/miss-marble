var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// constants.ts
var GOOGLE_FORM_ORDER_FIELDS = {
  paid: 0,
  created_at: 1,
  name: 2,
  phone: 3,
  date: 4,
  time: 5,
  cake: [6, 7],
  letter: 8,
  taste: [10, 11, 12, 13],
  inner_taste: [14],
  bottom_taste: [15],
  size: 18,
  shape: [19, 20],
  color: [9, 16],
  sentence: 25,
  paid_sentence: [26, 27],
  toppings: 21,
  decorations: [22, 23, 24],
  social_name: 28,
  order_from: 29,
  delivery_method: 30,
  delivery_address: [31, 32],
  remarks: [33],
  printed_at: 89,
  printed: 90
  // index: 91,
};

// integrations/google-sheet.ts
var import_fs = __toESM(require("fs"));
var import_googleapis = require("googleapis");
var import_path = __toESM(require("path"));
var SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets"
];
var spreadSheetId = process.env.GOOGLE_FORM_SPREADSHEET_ID;
var json = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON ?? import_fs.default.readFileSync(import_path.default.join(process.cwd(), "marble-service-account.json")));
var GoogleSheetRespository = class {
  googleSheet;
  jwtClient = new import_googleapis.google.auth.JWT(
    json.client_email,
    void 0,
    json.private_key,
    SCOPES
  );
  spreadSheetId;
  snapshotSpreadSheetId;
  constructor({ spreadSheetId: _spreadSheetId = spreadSheetId, snapshotSpreadSheetId } = {}) {
    this.googleSheet = import_googleapis.google.sheets("v4");
    this.spreadSheetId = _spreadSheetId;
    this.snapshotSpreadSheetId = snapshotSpreadSheetId;
  }
  async init() {
    await new Promise((resolve, reject) => {
      this.jwtClient.authorize(function(err) {
        if (err) {
          reject(err);
          return;
        } else {
          resolve(void 0);
        }
      });
      import_googleapis.google.options({ auth: this.jwtClient });
    });
    return this;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async insertRow(row) {
    const values = [
      row
    ];
    await this.init();
    await this.googleSheet.spreadsheets.values.append({
      spreadsheetId: this.spreadSheetId,
      range: "A:A",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values
      }
    });
  }
  async getAllRows() {
    await this.init();
    const res = await this.googleSheet.spreadsheets.values.get({
      auth: this.jwtClient,
      spreadsheetId: this.spreadSheetId,
      range: "A1:CM"
    });
    return (res.data.values ?? []).slice(1);
  }
};
var googlesheet = new GoogleSheetRespository({
  spreadSheetId
});
var google_sheet_default = googlesheet;

// sync-google-form.ts
var import_date_fns = require("date-fns");
var import_dayjs = __toESM(require("dayjs"));
var import_customParseFormat = __toESM(require("dayjs/plugin/customParseFormat"));
var import_timezone = __toESM(require("dayjs/plugin/timezone"));
var import_client = require("@prisma/client");
import_dayjs.default.extend(import_customParseFormat.default);
import_dayjs.default.extend(import_timezone.default);
var isSyncing = false;
var syncGoogleForm = async () => {
  var _a, _b;
  if (isSyncing) {
    return;
  }
  isSyncing = true;
  const prisma = new import_client.PrismaClient();
  try {
    let getField = function(record, key) {
      const field = fields[key];
      const convertValue = (value) => {
        switch (key) {
          case "paid":
            return value === "TRUE" ? "CAPTURED" : "AWAITING";
          case "created_at":
            value = (0, import_date_fns.parse)(`${value}+08`, "M/d/y H:mm:ssX", /* @__PURE__ */ new Date());
            if (!(0, import_date_fns.isValid)(value)) {
              value = void 0;
              value = /* @__PURE__ */ new Date();
            }
            return value;
          case "date":
            const createdAt = getField(record, "created_at");
            value = (0, import_date_fns.parse)(`${value} ${getField(record, "time").replace(":", "").slice(0, 4)}+08`, "M/d HmmX", createdAt ? new Date(createdAt) : /* @__PURE__ */ new Date());
            if (!(0, import_date_fns.isValid)(value)) {
              return void 0;
            }
            if ((0, import_date_fns.isBefore)(value, createdAt)) {
              value = (0, import_date_fns.addYears)(value, 1);
            }
            return value;
          case "decorations":
          case "toppings":
            return (value || "").split(", ").filter(Boolean).join(", ");
          case "paid_sentence":
            return (value || "").replace(/寫字朱古力牌[^,|，]*(,|，)/, "").trim();
          default:
            return (value || "").trim();
        }
      };
      if (Array.isArray(field)) {
        return field.map((f) => record[f]).map(convertValue).filter(Boolean).join(", ");
      }
      return convertValue(record[field]);
    }, getExternalId = function(record) {
      return `${getField(record, "created_at").toISOString()}/${getField(record, "phone")}`;
    };
    const shippingOptions = await prisma.shippingOption.findMany({ include: { name: true } });
    const delivery = shippingOptions.find((option) => {
      var _a2, _b2;
      return (_b2 = (_a2 = option.name.text) == null ? void 0 : _a2.zh_Hant_HK) == null ? void 0 : _b2.includes("\u9001\u4E0A\u9580");
    });
    const pickup = shippingOptions.find((option) => {
      var _a2, _b2;
      return (_b2 = (_a2 = option.name.text) == null ? void 0 : _a2.zh_Hant_HK) == null ? void 0 : _b2.includes("\u9580\u5E02");
    });
    const fields = GOOGLE_FORM_ORDER_FIELDS;
    console.log("[Sync Google Form]: Starting to sync...");
    return;
    const records = (await google_sheet_default.getAllRows()).reverse();
    const extenalOrders = await prisma.order.findMany({
      where: {
        externalId: {
          not: {
            equals: null
          }
        }
      }
    });
    const externnalOrderByExternalId = extenalOrders.reduce((acc, order) => {
      if (!order.externalId) {
        return acc;
      }
      acc[order.externalId] = order;
      return acc;
    }, {});
    let count = 0;
    let createCount = 0, updateCount = 0, skipCount = 0, deleteCount = 0, errorCount = 0;
    for (const r of records) {
      count++;
      if (!getField(r, "date")) {
        skipCount++;
        continue;
      }
      try {
        const externalData = JSON.stringify(r);
        const existing = externnalOrderByExternalId[getExternalId(r)];
        console.log(`[Sync Google Form]: Syncing ${++count}/${records.length}... ${(existing == null ? void 0 : existing.externalData) === externalData ? "Updating" : "Creating"} ${getExternalId(r)}`);
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
                orderId: existing.id
              }
            }
          });
        } else {
          createCount++;
        }
        await prisma.order.upsert({
          where: {
            externalId: getExternalId(r)
          },
          create: {
            externalData,
            createdAt: getField(r, "created_at"),
            paymentStatus: getField(r, "paid"),
            externalId: getExternalId(r),
            currency: {
              connect: {
                code: "hkd"
              }
            },
            subtotal: 0,
            discountTotal: 0,
            shippingTotal: 0,
            total: 0,
            shippingAddress: {
              create: {
                name: getField(r, "name"),
                address1: getField(r, "delivery_address") ?? "",
                address2: ""
              }
            },
            shippingOption: {
              connect: {
                id: ((_a = getField(r, "delivery_method")) == null ? void 0 : _a.includes("\u81EA\u53D6")) ? pickup == null ? void 0 : pickup.id : delivery == null ? void 0 : delivery.id
              }
            },
            deliveryDate: getField(r, "date"),
            name: getField(r, "name"),
            phoneNumber: getField(r, "phone"),
            socialChannel: getField(r, "order_from"),
            socialHandle: getField(r, "social_name"),
            remark: getField(r, "remarks"),
            items: {
              create: {
                productFieldValues: {
                  create: productFields.map((field) => ({
                    field: {
                      connect: {
                        id: field.id
                      }
                    },
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
                    fieldValue: getField(r, field.alias)
                  }))
                },
                quantity: 1,
                subtotal: 0,
                shippingTotal: 0,
                total: 0
              }
            }
          },
          update: {
            externalData,
            createdAt: getField(r, "created_at"),
            paymentStatus: getField(r, "paid"),
            externalId: getExternalId(r),
            currency: {
              connect: {
                code: "hkd"
              }
            },
            subtotal: 0,
            discountTotal: 0,
            shippingTotal: 0,
            total: 0,
            shippingAddress: {
              update: {
                name: getField(r, "name"),
                address1: getField(r, "delivery_address") ?? "",
                address2: ""
              }
            },
            shippingOption: {
              connect: {
                id: ((_b = getField(r, "delivery_method")) == null ? void 0 : _b.includes("\u81EA\u53D6")) ? pickup == null ? void 0 : pickup.id : delivery == null ? void 0 : delivery.id
              }
            },
            deliveryDate: getField(r, "date"),
            name: getField(r, "name"),
            phoneNumber: getField(r, "phone"),
            socialChannel: getField(r, "order_from"),
            socialHandle: getField(r, "social_name"),
            remark: getField(r, "remarks"),
            items: {
              create: {
                productFieldValues: {
                  create: productFields.map((field) => ({
                    field: {
                      connect: {
                        id: field.id
                      }
                    },
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
                    fieldValue: getField(r, field.alias)
                  }))
                },
                quantity: 1,
                subtotal: 0,
                shippingTotal: 0,
                total: 0
              }
            }
          }
        });
      } catch (e) {
        console.error(e);
        errorCount++;
      }
    }
    try {
      const { count: count2 } = await prisma.order.deleteMany({
        where: {
          externalId: {
            not: {
              equals: null
            },
            notIn: records.map(getExternalId).filter(Boolean)
          }
        }
      });
      deleteCount += count2;
    } catch (e) {
      console.error(e);
    }
    console.log(`[Sync Google Form]: Finished syncing. ${createCount} added, ${updateCount} updated, ${skipCount} skipped, ${deleteCount} deleted.`);
  } finally {
    await prisma.$disconnect();
    isSyncing = false;
  }
};
syncGoogleForm();
console.log(`Registered cronjob sync-google-form ${(/* @__PURE__ */ new Date()).toISOString()}`);
