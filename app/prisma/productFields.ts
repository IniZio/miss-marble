import { type PrismaClient } from '@prisma/client';

export async function seed(prisma: PrismaClient) {
  // Taste
  const fieldTaste = await prisma.productField.create({
    data: {
      name: {
        create: { text: { zh_Hant_HK: '蛋糕味道' } },
      },
      type: 'SELECT',
    }
  });
  const fieldTasteValues = [
    await prisma.productFieldValue.create({
      data: {
        name: {
          create: { text: { zh_Hant_HK: '朱古力' } },
        },
        field: { connect: { id: fieldTaste.id } }
      }
    }),
  ];

  // 寫字朱古力牌
  const fieldChocolateWriting = await prisma.productField.create({
    data: {
      name: {
        create: { text: { zh_Hant_HK: '寫字朱古力牌' } },
      },
      type: 'TEXT',
    }
  });

  // 蛋糕面裝飾
  const fieldCakeToppingDecoration = await prisma.productField.create({
    data: {
      name: {
        create: { text: { zh_Hant_HK: '蛋糕面裝飾' } },
      },
      type: 'CHECKBOXES',
    }
  });
  const fieldCakeToppingDecorationValues = [
    await prisma.productFieldValue.create({
      data: {
        name: {
          create: { text: { zh_Hant_HK: '追加自家製焦糖脆脆 (包含捶子, 焦糖脆脆)' } },
        },
        field: { connect: { id: fieldCakeToppingDecoration.id } }
      }
    }),
    await prisma.productFieldValue.create({
      data: {
        name: {
          create: { text: { zh_Hant_HK: '追加迷你麻糬粒 (+$10)' } },
        },
        field: { connect: { id: fieldCakeToppingDecoration.id } }
      }
    }),
  ];

  return { fieldTaste, fieldChocolateWriting, fieldCakeToppingDecoration } as const;
}