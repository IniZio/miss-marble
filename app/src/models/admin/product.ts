import { z } from 'zod';
import { apiAssetSchema } from '../asset';
import { apiProductFieldToProductSchema } from '../product';
import { apiTranslationSchema } from '../translation';

export const apiAdminProductSchema = z.object({
  id: z.string(),
  name: apiTranslationSchema,
  gallery: z.array(apiAssetSchema).nullish(),
  fields: z.array(apiProductFieldToProductSchema)
})

export type ApiAdminProduct = z.infer<typeof apiAdminProductSchema>;