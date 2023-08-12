import { assetSchema } from '@/models/asset';
import { apiProductSchema } from '@/models/product'
import { type z } from 'zod'

export const productDetailSchema = apiProductSchema
  .transform((product) => {
    return {
      id: product.id,
      name: product.name,
      image: assetSchema.nullish().parse(product.gallery?.[0]),
    }
  })

export type ProductDetail = z.infer<typeof productDetailSchema>;