import { z } from 'zod';
import { apiTranslationSchema } from '../translation';
import { api } from '@/lib/api';

export enum ProductFieldType {
  Text = 'TEXT',
  Select = 'SELECT',
  Checkboxes = 'CHECKBOXES',
  Asset = 'ASSET',
}

export const apiAdminProductFieldOptionSchema = z.object({
  id: z.string(),
  name: apiTranslationSchema,
});

export const apiListAdminProductFieldSchema = z.object({
  id: z.string(),
  alias: z.string(),
  type: z.nativeEnum(ProductFieldType),
  name: apiTranslationSchema,
})

export type ApiListAdminProductField = z.infer<typeof apiListAdminProductFieldSchema>;
export type ApiAdminProductFieldOption = z.infer<typeof apiAdminProductFieldOptionSchema>;

export const apiAdminProductFieldDetailSchema = z.object({
  id: z.string(),
  alias: z.string(),
  type: z.nativeEnum(ProductFieldType),
  name: apiTranslationSchema,
  fieldOptions: z.array(apiAdminProductFieldOptionSchema),
})

export type ApiAdminProductFieldDetail = z.infer<typeof apiAdminProductFieldDetailSchema>;