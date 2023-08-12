import { api } from '@/lib/utils/api';
import { type ServerSideHelpers } from '@/lib/utils/createServerSideHelpers';
import { productDetailSchema } from '../models/ProductDetail';
import { useMemo } from 'react';

export async function prefetchProductDetail(helpers: ServerSideHelpers, productId: string) {
  await helpers.product.detail.prefetch(productId)
}

export function useProductDetail(productId: string) {
  const { data, ...rest } = api.product.detail.useQuery(productId);
  const parsedData = useMemo(() => productDetailSchema.parse(data), [data]);

  return { data: parsedData, ...rest };
}