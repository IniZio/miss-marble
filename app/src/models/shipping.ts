import { apiTranslationSchema } from '@/models/translation';
import { z } from 'zod';

export const apiMoneyAmountSchema = z.object({
  currencyCode: z.string(),
  amount: z.number(),
});

export const apiShippingOptionSchema = z.object({
  id: z.string(),
  name: apiTranslationSchema,
  priceType: z.enum(['FLAT_RATE', 'MANUAL']),
  price: apiMoneyAmountSchema.nullable(),
})

export type ShippingOption = z.infer<typeof apiShippingOptionSchema>;
