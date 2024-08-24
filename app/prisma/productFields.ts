import { type GOOGLE_FORM_ORDER_FIELDS } from '@/constants';
import { type Product, type PrismaClient } from '@prisma/client';

export async function seed(prisma: PrismaClient) {
  await seedGoogleOrderProductFields(prisma);

  const common = await seedCommonProductFields(prisma);
  const section2 = await seedSection2ProductFields(prisma);
  const section3 = await seedSection3ProductFields(prisma);
  const section4 = await seedSection4ProductFields(prisma);
  const section5 = await seedSection5ProductFields(prisma);
  const section6 = await seedSection6ProductFields(prisma);
  const section7 = await seedSection7ProductFields(prisma);
  const section8 = await seedSection8ProductFields(prisma);

  return {
    common,
    section2,
    section3,
    section4,
    section5,
    section6,
    section7,
    section8,
  } as const;
}

async function seedGoogleOrderProductFields(prisma: PrismaClient) {
  const GOOGLE_ORDER_PRODUCT_FIELD_FIELDS: (keyof typeof GOOGLE_FORM_ORDER_FIELDS)[] = [
    'cake',
    'taste',
    'size',
    'color',
    'sentence',
    'paid_sentence',
    'toppings',
  ];

  for (const alias of GOOGLE_ORDER_PRODUCT_FIELD_FIELDS) {
    await prisma.productField.create({
      data: {
        alias,
        type: 'TEXT',
        name: { create: { text: { zh_Hant_HK: alias } } },
        remark: 'google-form',
        isReserved: true,
    } });
  }
}

async function seedCommonProductFields(prisma: PrismaClient) {
  return Promise.all([
    await prisma.productField.create({
      data: {
        alias: 'color',
        type: 'TEXT',
        name: { create: { text: { zh_Hant_HK: '顏色選擇' } } },
        remark: 'common',
      },
    }),
    await prisma.productField.create({
      data: {
        alias: 'size',
        type: 'SELECT',
        name: { create: { text: { zh_Hant_HK: '蛋糕尺吋' } } },
        remark: 'common',
        fieldOptions: {
          create: [
            { name: { create: { text: { zh_Hant_HK: '單層4吋' } } } },
            { name: { create: { text: { zh_Hant_HK: '單層6吋' } } } },
            { name: { create: { text: { zh_Hant_HK: '單層8吋' } } } },
            { name: { create: { text: { zh_Hant_HK: '雙層 4吋 x 6吋 (夾心蛋糕或凍餅)' } } } },
            { name: { create: { text: { zh_Hant_HK: '雙層 6吋 x 8吋(夾心蛋糕或凍餅)' } } } },
            { name: { create: { text: { zh_Hant_HK: '三層 4吋 x 6吋 x 8吋 (夾心蛋糕或凍餅)' } } } },
            { name: { create: { text: { zh_Hant_HK: 'Cupcake件裝' } } } },
          ],
        },
      },
    }),
    await prisma.productField.create({
      data: {
        alias: 'toppings',
        type: 'CHECKBOXES',
        name: { create: { text: { zh_Hant_HK: '蛋糕面裝飾：(想了解詳情可向CS查詢)' } } },
        remark: 'common',
        fieldOptions: {
          create: [
            { name: { create: { text: { zh_Hant_HK: '追加自家製焦糖脆脆 (包含捶子, 焦糖脆脆) (+$28)' } } } },
            { name: { create: { text: { zh_Hant_HK: '追加迷你麻糬粒 (+$10)' } } } },
            { name: { create: { text: { zh_Hant_HK: '黑/白朱古力淋面 (+ $20)' } } } },
            { name: { create: { text: { zh_Hant_HK: '糖果套裝 (+$68)(⭐配搭公仔推介)' } } } },
            { name: { create: { text: { zh_Hant_HK: 'mini酒𥖁套裝 (+$88) *款式隨機' } } } },
            { name: { create: { text: { zh_Hant_HK: '麻雀朱古力套裝 (+$68) *款式隨機' } } } },
            { name: { create: { text: { zh_Hant_HK: '(金色/藍色/粉紅色)閃片氣球 (+$58)' } } } },
            { name: { create: { text: { zh_Hant_HK: '閃閃燈 (+ $20)' } } } },
            { name: { create: { text: { zh_Hant_HK: '新鮮玫瑰花🌹@1(季節而定) (+ $45 up)' } } } },
            { name: { create: { text: { zh_Hant_HK: '新鮮小鮮花🌹(季節而定) (+ $25 up) *只適用網紅數字/字母系列' } } } },
            { name: { create: { text: { zh_Hant_HK: '仿花🌹@1(+ $25)' } } } },
            { name: { create: { text: { zh_Hant_HK: '公主皇冠 (+ $60) *視乎蛋糕大細安排不同size皇冠' } } } },
            { name: { create: { text: { zh_Hant_HK: '浪漫生日月亮燈 (+ $70)' } } } },
            { name: { create: { text: { zh_Hant_HK: '月球燈 (+ $60)' } } } },
            { name: { create: { text: { zh_Hant_HK: '蠟燭刀叉碟套裝(5人份量) (+ $12)' } } } },
            { name: { create: { text: { zh_Hant_HK: '蠟燭🕯️(+ $5)' } } } },
          ],
        },
      },
    }),
    await prisma.productField.create({
      data: {
        alias: 'decorations',
        type: 'CHECKBOXES',
        name: { create: { text: { zh_Hant_HK: '插牌裝飾(想了解詳情可向CS查詢)' } } },
        remark: 'common',
        fieldOptions: {
          create: [
            { name: { create: { text: { zh_Hant_HK: '生日插牌 (+ $20)' } } } },
            { name: { create: { text: { zh_Hant_HK: '*(推介) 訂製人名生日牌  (+ $98)' } } } },
            { name: { create: { text: { zh_Hant_HK: '翻糖字(+$30up)' } } } },
          ],
        },
      },
    }),
    await prisma.productField.create({
      data: {
        alias: 'paid_sentence',
        type: 'TEXT',
        name: { create: { text: { zh_Hant_HK: '寫字朱古力牌 (+$10)(只限20個字母)' } } },
        remark: 'common',
      },
    }),
    await prisma.productField.create({
      data: {
        alias: 'sentence',
        type: 'TEXT',
        name: { create: { text: { zh_Hant_HK: '寫名： *板上免費朱古力寫字 (只限8個字母)' } } },
        remark: 'common',
      },
    }),
  ]);
}

async function seedSection2ProductFields(prisma: PrismaClient) {
  return Promise.all([
    await prisma.productField.create({
      data: {
        alias: 'taste',
        type: 'CHECKBOXES',
        name: { create: { text: { zh_Hant_HK: '生酮蛋糕味道' } } },
        remark: 'section-2',
        fieldOptions: {
          create: [
            { name: { create: { text: { zh_Hant_HK: '生酮海鹽芝士奶蓋+$20' } } } },
            { name: { create: { text: { zh_Hant_HK: '生酮抹茶' } } } },
            { name: { create: { text: { zh_Hant_HK: '養生生酮黑芝麻' } } } },
            { name: { create: { text: { zh_Hant_HK: '皇牌生酮伯爵茶+$20' } } } },
            { name: { create: { text: { zh_Hant_HK: '生酮原味雲呢拿' } } } },
            { name: { create: { text: { zh_Hant_HK: '生酮香濃朱古力' } } } },
            { name: { create: { text: { zh_Hant_HK: '生酮巴斯克流心蛋糕' } } } },
            { name: { create: { text: { zh_Hant_HK: '（可選擇加配）生酮麻薯$38' } } } },
          ],
        },
      },
    }),
  ]);
}

async function seedSection3ProductFields(prisma: PrismaClient) {
  return Promise.all([
    await prisma.productField.create({
      data: {
        alias: 'cake',
        type: 'SELECT',
        name: { create: { text: { zh_Hant_HK: '請選擇系列' } } },
        remark: 'section-3',
        fieldOptions: {
          create: [
            { name: { create: { text: { zh_Hant_HK: '寶藏金幣系列' } } } },
            { name: { create: { text: { zh_Hant_HK: '金錢世界系列' } } } },
            { name: { create: { text: { zh_Hant_HK: 'Poker啤牌系列' } } } },
            { name: { create: { text: { zh_Hant_HK: 'Boss set系列' } } } },
            { name: { create: { text: { zh_Hant_HK: 'Bitcoin 系列(+$20)' } } } },
            { name: { create: { text: { zh_Hant_HK: '麻雀系列(+$30)' } } } },
          ],
        },
      },
    }),
  ]);
}

export async function seedSection4ProductFields(prisma: PrismaClient) {
  return Promise.all([
    await prisma.productField.create({
      data: {
        alias: 'taste',
        type: 'SELECT',
        name: { create: { text: { zh_Hant_HK: '蛋糕味道' } } },
        remark: 'section-4',
        fieldOptions: {
          create: [
            { name: { create: { text: { zh_Hant_HK: '比利時72%特濃朱古力' } } } },
            { name: { create: { text: { zh_Hant_HK: '海鹽芝土奶蓋' } } } },
            { name: { create: { text: { zh_Hant_HK: '海鹽焦糖' } } } },
            { name: { create: { text: { zh_Hant_HK: '抹茶牛奶' } } } },
            { name: { create: { text: { zh_Hant_HK: '紫薯牛奶' } } } },
            { name: { create: { text: { zh_Hant_HK: '香甜草莓牛奶' } } } },
            { name: { create: { text: { zh_Hant_HK: '香芋牛奶' } } } },
            { name: { create: { text: { zh_Hant_HK: '栗子牛奶' } } } },
            { name: { create: { text: { zh_Hant_HK: '炭燒咖啡' } } } },
            { name: { create: { text: { zh_Hant_HK: '白兔糖牛奶(+$10)' } } } },
            { name: { create: { text: { zh_Hant_HK: '香蕉朱古力(+$10)' } } } },
            { name: { create: { text: { zh_Hant_HK: 'Oreo 朱古力(+$10)' } } } },
            { name: { create: { text: { zh_Hant_HK: 'Nutella 朱古力(+$10)' } } } },
            { name: { create: { text: { zh_Hant_HK: '薄荷朱古力(+$10)' } } } },
            { name: { create: { text: { zh_Hant_HK: '阿華田朱古力(+$10)' } } } },
            { name: { create: { text: { zh_Hant_HK: '金莎黑朱古力*(內有榛子粒)(+$10)' } } } },
            { name: { create: { text: { zh_Hant_HK: '(No.1) Twinings 伯爵茶(+$20)' } } } },
            { name: { create: { text: { zh_Hant_HK: '粒粒芒果(+$20)' } } } },
            { name: { create: { text: { zh_Hant_HK: '港式檸檬茶(+$20)' } } } },
            { name: { create: { text: { zh_Hant_HK: '楊枝甘露(+$20)' } } } },
            { name: { create: { text: { zh_Hant_HK: '朱古力花生醬(+$20)' } } } },
            { name: { create: { text: { zh_Hant_HK: '白桃茉莉花茶(+$20)' } } } },
            { name: { create: { text: { zh_Hant_HK: '荔枝玫瑰花茶(+$20)' } } } },
            { name: { create: { text: { zh_Hant_HK: '日本培茶(+$20)' } } } },
            { name: { create: { text: { zh_Hant_HK: 'Baileys朱古力(+$30)' } } } },
            { name: { create: { text: { zh_Hant_HK: 'Tiramisu芝士咖啡 (+$30)' } } } },
            { name: { create: { text: { zh_Hant_HK: '極低糖忌廉配極低糖蛋糕(BB專用)^非流心' } } } },
            { name: { create: { text: { zh_Hant_HK: '日本開心果 (+$50)' } } } },
          ],
        },
      },
    }),
  ]);
}

export async function seedSection5ProductFields(prisma: PrismaClient) {
  return Promise.all([
    await prisma.productField.create({
      data: {
        alias: 'inner_taste',
        type: 'SELECT',
        name: { create: { text: { zh_Hant_HK: '流心味道' } } },
        remark: 'section-5',
        fieldOptions: {
          create: [
            { name: { create: { text: { zh_Hant_HK: '海鹽芝土奶蓋流心' } } } },
            { name: { create: { text: { zh_Hant_HK: '海鹽焦糖脆脆流心 (包含捶子, 焦糖脆脆)' } } } },
          ],
        },
      },
    }),
    await prisma.productField.create({
      data: {
        alias: 'bottom_taste',
        type: 'SELECT',
        name: { create: { text: { zh_Hant_HK: '蛋糕底味道' } } },
        remark: 'section-5',
        fieldOptions: {
          create: [
            { name: { create: { text: { zh_Hant_HK: '原味雞蛋糕 (FREE)' } } } },
            { name: { create: { text: { zh_Hant_HK: 'Twinings伯爵茶 (+$30)' } } } },
            { name: { create: { text: { zh_Hant_HK: '比利時72%特濃朱古力(+20)' } } } },
          ],
        },
      },
    })
  ]);
}

export async function seedSection6ProductFields(prisma: PrismaClient) {
  return Promise.all([
    await prisma.productField.create({
      data: {
        alias: 'letter',
        type: 'TEXT',
        name: { create: { text: { zh_Hant_HK: '寫名： 數字/字母' } } },
        remark: 'section-6',
      },
    }),
    await prisma.productField.create({
      data: {
        alias: 'bottom_taste',
        type: 'SELECT',
        name: { create: { text: { zh_Hant_HK: '蛋糕味道' } } },
        remark: 'section-6',
        fieldOptions: {
          create: [
            { name: { create: { text: { zh_Hant_HK: '原味雞蛋糕 (FREE)' } } } },
            { name: { create: { text: { zh_Hant_HK: 'Twinings伯爵茶 (+$30)' } } } },
            { name: { create: { text: { zh_Hant_HK: '比利時72%特濃朱古力(+20)' } } } },
          ],
        },
      },
    }),
  ]);
}

export async function seedSection7ProductFields(prisma: PrismaClient) {
  return Promise.all([
    await prisma.productField.create({
      data: {
        alias: 'bottom_taste',
        type: 'SELECT',
        name: { create: { text: { zh_Hant_HK: '蛋糕味道' } } },
        remark: 'section-6',
        fieldOptions: {
          create: [
            { name: { create: { text: { zh_Hant_HK: '黑糖奶茶珍珠' } } } },
            { name: { create: { text: { zh_Hant_HK: '粒粒草莓珍珠' } } } },
            { name: { create: { text: { zh_Hant_HK: '伊藤園抹茶牛奶珍珠' } } } },
            { name: { create: { text: { zh_Hant_HK: '比利時72%特濃朱古力珍珠' } } } },
            { name: { create: { text: { zh_Hant_HK: '炭燒咖啡珍珠' } } } },
            { name: { create: { text: { zh_Hant_HK: '粒粒芒果爆珠 (+ $18)' } } } },
            { name: { create: { text: { zh_Hant_HK: '白兔糖珍珠  (+ $18)' } } } },
            { name: { create: { text: { zh_Hant_HK: '港式檸檬茶爆珠(+ $18)' } } } },
            { name: { create: { text: { zh_Hant_HK: '阿華田珍珠  (+ $18)' } } } },
          ],
        },
      },
    }),
  ]);
}

export async function seedSection8ProductFields(prisma: PrismaClient) {
  return Promise.all([]) as Promise<Product[]>;
}
