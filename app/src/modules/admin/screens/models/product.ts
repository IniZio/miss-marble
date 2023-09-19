import { apiAdminProductSchema } from '@/models/admin/product'
import { apiAssetUploadSchema, assetSchema } from '@/models/asset'
import { apiTranslationInputSchema, apiTranslationSchema } from '@/models/translation'
import { productDetailFieldSchema } from '@/modules/product/models/productDetail'
import { z } from 'zod'

export const listAdminProductSchema = apiAdminProductSchema
  .transform((product) => {
    return {
      id: product.id,
      name: product.name,
      image: assetSchema.nullish().parse(product.gallery?.[0]),
    }
  })

export type ListAdminProduct = z.infer<typeof listAdminProductSchema>

export const getAdminProductDetailSchema = apiAdminProductSchema
  .transform((product) => {
    return {
      id: product.id,
      name: product.name,
      gallery: z.array(assetSchema).parse(product.gallery),
      fields: z.array(productDetailFieldSchema).parse(product.fields),
    }
  });

export const editAdminProductSchema = z.object({
  id: z.string().optional(),
  name: apiTranslationInputSchema,
  gallery: z.array(apiAssetUploadSchema).default([]),
  // fields: z.array(productDetailFieldSchema),
});

export type EditAdminProduct = z.infer<typeof editAdminProductSchema>;