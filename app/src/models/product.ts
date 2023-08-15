import { z } from 'zod';
import { apiAssetSchema } from './asset';
import { apiTranslationSchema } from './translation';

export const apiProductFieldValueSchema = z.object({
  id: z.string(),
  name: apiTranslationSchema,
});

export enum ProductFieldType {
  Text = 'TEXT',
  Select = 'SELECT',
  Checkboxes = 'CHECKBOXES',
}

export const apiProductFieldSchema = z.object({
  id: z.string(),
  name: apiTranslationSchema,
  type: z.nativeEnum(ProductFieldType),
  fieldValues: z.array(apiProductFieldValueSchema),
});

export type ProductField = z.infer<typeof apiProductFieldSchema>;

export const apiProductSchema = z.object({
  id: z.string(),
  name: apiTranslationSchema,
  gallery: z.array(apiAssetSchema).nullish(),
  fields: z.array(apiProductFieldSchema)
})