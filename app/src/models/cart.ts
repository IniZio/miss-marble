import { z } from 'zod';
import { apiAssetUploadSchema } from './asset';

export const lineItemSchema = z.object({
  productId: z.string(),
  productVariantId: z.string().nullish(),
  productFieldValues: z.array(z.object({
    fieldId: z.string(),
    fieldOptionId: z.string().nullish(),
    asset: apiAssetUploadSchema.nullish(),
    value: z.string().nullish(),
  })),
  quantity: z.number().int().positive(),
});

export type LineItem = z.infer<typeof lineItemSchema>;