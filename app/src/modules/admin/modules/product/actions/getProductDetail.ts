import { api } from '@/lib/api';
import { type ServerSideHelpers } from '@/lib/createServerSideHelpers';
import { apiAdminProductSchema } from '@/models/admin/product';
import { apiShippingOptionSchema } from '@/models/shipping';
import { useMemo } from 'react';
import { z } from 'zod';
import { getAdminProductDetailSchema, listAdminProductSchema } from '../models/product';

export function useGetProductDetail(id: string) {
  const { data, ...rest } = api.admin.product.detail.useQuery(id);
  const parsedData = useMemo(() => !!data ? getAdminProductDetailSchema.parse(data) : null, [data]);

  return { data: parsedData, ...rest };
}