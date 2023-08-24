import { type PrismaClient } from '@prisma/client';
import { type seed as seedCurrencies } from './shared/currencies'

export async function seed(prisma: PrismaClient, currencies: Awaited<ReturnType<typeof seedCurrencies>>) {
  // Taste
  const fieldTaste = await prisma.productField.create({
    data: {
      name: {
        create: { text: { zh_Hant_HK: '蛋糕味道' } },
      },
      type: 'SELECT',
    }
  });
  const fieldTasteOptions = [
    await prisma.productFieldOption.create({
      data: {
        name: {
          create: { text: { zh_Hant_HK: '朱古力' } },
        },
        field: { connect: { id: fieldTaste.id } },
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
  const fieldCakeToppingDecorationOptions = [
    await prisma.productFieldOption.create({
      data: {
        name: {
          create: { text: { zh_Hant_HK: '追加自家製焦糖脆脆 (包含捶子, 焦糖脆脆)' } },
        },
        field: { connect: { id: fieldCakeToppingDecoration.id } }
      }
    }),
    await prisma.productFieldOption.create({
      data: {
        name: {
          create: { text: { zh_Hant_HK: '追加迷你麻糬粒 (+$10)' } },
        },
        field: { connect: { id: fieldCakeToppingDecoration.id } }
      }
    }),
  ];

  const fieldUpload = await prisma.productField.create({
    data: {
      name: {
        create: { text: { zh_Hant_HK: '上傳D野' } },
      },
      type: 'ASSET',
    }
  });

  return { fieldTaste, fieldChocolateWriting, fieldCakeToppingDecoration, fieldUpload } as const;
}