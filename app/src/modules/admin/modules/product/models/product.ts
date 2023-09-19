import { apiAdminProductSchema } from '@/models/admin/product'
import { apiAssetUploadSchema, assetSchema } from '@/models/asset'
import { apiProductFieldToProductSchema } from '@/models/product'
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

export const productFieldToProductSchema = apiProductFieldToProductSchema;

export const getAdminProductDetailSchema = apiAdminProductSchema
  .transform((product) => {
    return {
      id: product.id,
      name: product.name,
      gallery: z.array(assetSchema).parse(product.gallery),
      fields: z.array(productFieldToProductSchema).parse(product.fields),
    }
  });

export type GetAdminProductDetail = z.infer<typeof getAdminProductDetailSchema>;

export const productFieldToProductInputSchema = z.object({
  fieldId: z.string(),
  required: z.boolean().default(false),
});

export const editAdminProductSchema = z.object({
  id: z.string().optional(),
  name: apiTranslationInputSchema,
  gallery: z.array(apiAssetUploadSchema).default([]),
  fields: z.array(productFieldToProductInputSchema),
});

export type EditAdminProduct = z.infer<typeof editAdminProductSchema>;