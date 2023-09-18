import { api } from '@/lib/api';
import { type ServerSideHelpers } from '@/lib/createServerSideHelpers';
import { productDetailSchema } from '../models/productDetail';
import { useMemo } from 'react';

export async function prefetchProductDetail(helpers: ServerSideHelpers, productId: string) {
  // TODO: Handle not found
  await helpers.product.detail.prefetch(productId);
}

export function useProductDetail(productId: string) {
  const { data, ...rest } = api.product.detail.useQuery(productId);
  const parsedData = useMemo(() => data ? productDetailSchema.parse(data) : null, [data]);

  return { data: parsedData, ...rest };
}