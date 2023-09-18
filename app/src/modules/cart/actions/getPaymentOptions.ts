import { api } from '@/lib/api';
import { type ServerSideHelpers } from '@/lib/createServerSideHelpers';
import { apiPaymentOptionSchema } from '@/models/payment';
import { useMemo } from 'react';
import { z } from 'zod';

export async function prefetchPaymentOptions(helpers: ServerSideHelpers) {
  await helpers.paymentOptions.list.prefetch();
}

export function usePaymentOptions() {
  const { data, ...rest } = api.paymentOptions.list.useQuery();
  const parsedData = useMemo(() => data ? z.array(apiPaymentOptionSchema).parse(data) : null, [data]);

  return { data: parsedData, ...rest };
}