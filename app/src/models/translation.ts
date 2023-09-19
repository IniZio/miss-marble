import { z } from 'zod';

export const apiTranslationSchema = z.object({
  id: z.string(),
  text: z.record(z.string()),
});

export const translationSchema = apiTranslationSchema;

export type Translation = z.infer<typeof translationSchema>;

export const apiTranslationInputSchema = z.object({
  id: z.string().optional(),
  text: z.record(z.string()),
});