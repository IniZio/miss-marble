import { apiAdminProductSchema } from '@/models/admin/product'
import { ProductFieldType, apiAdminProductFieldDetailSchema, apiListAdminProductFieldSchema } from '@/models/admin/productField'
import { apiAssetUploadSchema, assetSchema } from '@/models/asset'
import { apiTranslationInputSchema, apiTranslationSchema } from '@/models/translation'
import { productDetailFieldSchema } from '@/modules/product/models/productDetail'
import { z } from 'zod'


export const listAdminProductFieldSchema = apiListAdminProductFieldSchema
  .transform((field) => {
    return {
      id: field.id,
      alias: field.alias,
      type: field.type,
      name: field.name,
      options: field.fieldOptions,
    }
  })

export type ListAdminProductField = z.infer<typeof listAdminProductFieldSchema>

export const getAdminProductFieldDetailSchema = apiAdminProductFieldDetailSchema
  .transform((field) => {
    return {
      id: field.id,
      alias: field.alias,
      type: field.type,
      name: field.name,
      fieldOptions: field.fieldOptions,
    }
  })

export type GetAdminProductFieldDetail = z.infer<typeof getAdminProductFieldDetailSchema>

export const editAdminProductFieldOptionsSchema = z.object({
  id: z.string().optional(),
  name: apiTranslationInputSchema,
});

export const editAdminProductFieldSchema = z.object({
  id: z.string().optional(),
  alias: z.string(),
  type: z.nativeEnum(ProductFieldType),
  name: apiTranslationInputSchema,
  fieldOptions: z.array(editAdminProductFieldOptionsSchema).default([]),
});

export type EditAdminProductField = z.infer<typeof editAdminProductFieldSchema>;