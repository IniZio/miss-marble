import { assetSchema } from '@/models/asset';
import { apiProductSchema, productFieldSchema } from '@/models/product'
import { z } from 'zod'

export const productDetailFieldSchema = productFieldSchema;

export const productDetailSchema = apiProductSchema
  .transform((product) => {
    return {
      id: product.id,
      name: product.name,
      image: assetSchema.nullish().parse(product.gallery?.[0]),
      fields: z.array(productDetailFieldSchema).parse(product.fields),
    }
  })

export type ProductDetail = z.infer<typeof productDetailSchema>;
export type ProductDetailField = z.infer<typeof productDetailFieldSchema>;