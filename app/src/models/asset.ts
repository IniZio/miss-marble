import { z } from 'zod';

export const apiAssetSchema = z.object({
  id: z.string(),
  provider: z.string(),
  objectKey: z.string(),
  mimeType: z.string(),
})

export const assetSchema = apiAssetSchema
  .transform((asset) => ({
    ...asset,
    url: `${process.env.NEXT_PUBLIC_ASSET_URL}/${asset.objectKey}`,
  }));

export type Asset = z.infer<typeof assetSchema>;