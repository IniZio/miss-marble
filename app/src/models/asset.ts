import { z } from 'zod';

export const apiAssetSchema = z.object({
  id: z.string(),
  provider: z.string(),
  objectKey: z.string(),
  mimeType: z.string(),
  url: z.string(),
})

export const assetSchema = apiAssetSchema;

export type Asset = z.infer<typeof assetSchema>;