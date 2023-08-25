import { z } from 'zod';

export const lineItemSchema = z.object({
  productId: z.string(),
  productVariantId: z.string().nullish(),
  quantity: z.number().int().positive(),
});

export type LineItem = z.infer<typeof lineItemSchema>;