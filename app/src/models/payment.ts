import { z } from 'zod';
import { apiTranslationSchema } from './translation';

export const apiPaymentOptionSchema = z.object({
  id: z.string(),
  name: apiTranslationSchema,
  instructions: apiTranslationSchema.nullable(),
});

export type PaymentOption = z.infer<typeof apiPaymentOptionSchema>;