import { assetSchema } from '@/models/asset';
import { apiProductSchema } from '@/models/product'
import { type z } from 'zod'

export const recommendedProductSchema = apiProductSchema
  .transform((product) => {
    return {
      id: product.id,
      name: product.name,
      image: assetSchema.nullish().parse(product.gallery?.[0]),
    }
  })

export type RecommendedProduct = z.infer<typeof recommendedProductSchema>;