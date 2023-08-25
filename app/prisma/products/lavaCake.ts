import { type PrismaClient } from '@prisma/client';
import { uploadPublicAsset } from 'prisma/utils';
import { type seed as seedProductFields } from '../productFields';

export async function seed(prisma: PrismaClient , productFields: Awaited<ReturnType<typeof seedProductFields>>) {
  const asset = await uploadPublicAsset('lava-cake.png');
  const product = await prisma.product.create({
    data: {
      name: {
        create: {
          text: { zh_Hant_HK: '雲石流心系列' },
        }
      },
      gallery: {
        create: asset,
      },
    }
  });

  await prisma.productFieldToProduct.createMany({
    data: [
      { productId: product.id, fieldId: productFields.fieldChocolateWriting.id },
      { productId: product.id, fieldId: productFields.fieldCakeToppingDecoration.id },
      { productId: product.id, fieldId: productFields.fieldUpload.id },
    ]
  });

  return product;
}