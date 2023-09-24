import { type GOOGLE_FORM_ORDER_FIELDS } from '@/constants';
import { type PrismaClient } from '@prisma/client';

export async function seed(prisma: PrismaClient) {
  const PRODUCT_FIELD_FIELDS: (keyof typeof GOOGLE_FORM_ORDER_FIELDS)[] = ['cake', 'letter', 'taste', 'inner_taste', 'bottom_taste', 'size', 'shape', 'color', 'sentence', 'paid_sentence', 'toppings', 'decorations', ];

  for (const alias of PRODUCT_FIELD_FIELDS) {
    await prisma.productField.create({ data: { alias, type: 'TEXT', name: { create: { text: { zh_Hant_HK: alias } } } } });
  }

  return
}