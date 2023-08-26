import { api } from '@/lib/utils/api';
import { type ServerSideHelpers } from '@/lib/utils/createServerSideHelpers';
import { spiShippingOptionSchema } from '@/models/shipping';
import { useMemo } from 'react';
import { z } from 'zod';

export async function prefetchShippingOptions(helpers: ServerSideHelpers) {
  await helpers.shippingOptions.list.prefetch();
}

export function useShippingOptions() {
  const { data, ...rest } = api.shippingOptions.list.useQuery();
  const parsedData = useMemo(() => data ? z.array(spiShippingOptionSchema).parse(data) : null, [data]);

  return { data: parsedData, ...rest };
}