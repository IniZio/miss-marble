import { api } from '@/lib/api';
import { listOrderSchema } from '@/models/pos/list-order';
import { useMemo } from 'react';

export function useGetOrder({
  id,
}: {
  id: string,
}) {
  const { data, isLoading } = api.pos.order.detail.useQuery(id);

  const parsedData = useMemo(() => data ? listOrderSchema.parse(data) : null, [data]);

  return { data: parsedData, isLoading };
}