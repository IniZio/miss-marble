import { z } from 'zod';

export const apiTranslationSchema = z.object({
  id: z.string(),
  text: z.any(),
});

export const translationSchema = apiTranslationSchema;

export type Translation = z.infer<typeof translationSchema>;