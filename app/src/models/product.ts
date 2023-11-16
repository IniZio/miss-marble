import { z } from 'zod';
import { apiAssetSchema } from './asset';
import { apiTranslationSchema } from './translation';

export const apiProductFieldOptionSchema = z.object({
  id: z.string(),
  name: apiTranslationSchema,
});

export enum ProductFieldType {
  Text = 'TEXT',
  Select = 'SELECT',
  Checkboxes = 'CHECKBOXES',
  Asset = 'ASSET',
}

export const apiProductFieldSchema = z.object({
  id: z.string(),
  name: apiTranslationSchema,
  type: z.nativeEnum(ProductFieldType),
  fieldOptions: z.array(apiProductFieldOptionSchema),
});

export const apiProductFieldToProductSchema = z.object({
  field: apiProductFieldSchema,
  displayOrder: z.number().default(0),
  required: z.boolean().default(false),
});

export const productFieldSchema = apiProductFieldToProductSchema
  .transform((productFieldToProduct) => ({
    ...productFieldToProduct.field,
    required: productFieldToProduct.required,
    displayOrder: productFieldToProduct.displayOrder,
  }))

export type ProductField = z.infer<typeof productFieldSchema>;

export const apiProductSchema = z.object({
  id: z.string(),
  name: apiTranslationSchema,
  gallery: z.array(apiAssetSchema).nullish(),
  fields: z.array(apiProductFieldToProductSchema)
})