import { z } from 'zod';
import { apiAssetSchema } from './asset';
import { apiTranslationSchema } from './translation';

export const apiProductFieldValueSchema = z.object({
  id: z.string(),
  name: apiTranslationSchema,
});

export const apiProductFieldSchema = z.object({
  id: z.string(),
  name: apiTranslationSchema,
  type: z.string(),
  fieldValues: z.array(apiProductFieldValueSchema),
});

export const apiProductSchema = z.object({
  id: z.string(),
  name: apiTranslationSchema,
  gallery: z.array(apiAssetSchema).nullish(),
  fields: z.array(apiProductFieldSchema)
})