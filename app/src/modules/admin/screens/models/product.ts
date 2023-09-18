import { apiAdminProductSchema } from '@/models/admin/product'
import { assetSchema } from '@/models/asset'
import { type z } from 'zod'

export const listAdminProductSchema = apiAdminProductSchema
  .transform((product) => {
    return {
      id: product.id,
      name: product.name,
      image: assetSchema.nullish().parse(product.gallery?.[0]),
    }
  })

export type ListAdminProduct = z.infer<typeof listAdminProductSchema>