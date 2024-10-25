import { api } from '@/lib/api';
import { listOrderSchema } from '@/models/pos/list-order';
import { useMemo } from 'react';

export function useGetOrders({
  dateStart,
  dateEnd,
  keyword
}: {
  dateStart: Date,
  dateEnd: Date
  keyword?: string,
}) {
  const { data, isLoading, isFetching, refetch } = api.pos.order.list.useQuery({
    dateStart,
    dateEnd,
    keyword,
  }, {
    refetchInterval: 1000 * 60 * 5, // 5 minutes
  });

  const parsedData = useMemo(() => data?.map((order) => listOrderSchema.parse(order)), [data]);

  return { data: parsedData, isLoading, isFetching, refetch };
}
