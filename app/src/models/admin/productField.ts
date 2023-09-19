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
  // fieldOptions: z.array(apiAdminProductFieldOptionSchema),
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

export type ApiCreateAdminProductField = Parameters<ReturnType<typeof api.admin.productField.create.useMutation>['mutateAsync']>[0];
export type ApiEditAdminProductField = Parameters<ReturnType<typeof api.admin.productField.create.useMutation>['mutateAsync']>[0];