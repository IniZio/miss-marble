import { api } from '@/lib/api';
import { type ServerSideHelpers } from '@/lib/createServerSideHelpers';
import { apiAdminProductSchema } from '@/models/admin/product';
import { apiShippingOptionSchema } from '@/models/shipping';
import { useMemo } from 'react';
import { z } from 'zod';
import { getAdminProductFieldDetailSchema } from '../models/productFIeld';

export function useGetProductFieldDetail(id: string) {
  const { data, ...rest } = api.admin.productField.detail.useQuery(id);
  const parsedData = useMemo(() => !!data ? getAdminProductFieldDetailSchema.parse(data) : null, [data]);

  return { data: parsedData, ...rest };
}