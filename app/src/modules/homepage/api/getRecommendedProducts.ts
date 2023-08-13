import { api } from '@/lib/utils/api';
import { type ServerSideHelpers } from '@/lib/utils/createServerSideHelpers';
import { recommendedProductSchema } from '../models/product';
import { useMemo } from 'react';

export async function prefetchRecommendedProducts(helpers: ServerSideHelpers) {
  await helpers.product.paginate.prefetchInfinite({ filter: { collectionSlug: 'recommended' } });
}

export function useRecommendedProducts() {
  const { data, ...rest } = api.product.paginate.useInfiniteQuery({ filter: { collectionSlug: 'recommended' } });
  const parsedData = useMemo(() => data?.pages.flatMap(page => page.items).map(p => recommendedProductSchema.parse(p)), [data?.pages]);

  return { data: parsedData, ...rest };
}