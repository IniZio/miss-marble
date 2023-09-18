import { api } from '@/lib/api';
import { type ServerSideHelpers } from '@/lib/createServerSideHelpers';
import { recommendedProductSchema } from '../models/product';
import { useMemo } from 'react';

export async function prefetchRecommendedProducts(helpers: ServerSideHelpers) {
  await helpers.product.infinite.prefetchInfinite({});
}

export function useRecommendedProducts() {
  // const { data, ...rest } = api.product.infinite.useInfiniteQuery({ filter: { collectionSlug: 'recommended' } });
  const { data, ...rest } = api.product.infinite.useInfiniteQuery({});
  const parsedData = useMemo(() => data?.pages.flatMap(page => page.items).map(p => recommendedProductSchema.parse(p)), [data?.pages]);

  return { data: parsedData, ...rest };
}