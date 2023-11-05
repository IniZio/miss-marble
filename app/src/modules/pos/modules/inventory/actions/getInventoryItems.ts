import { api } from '@/lib/api';
import { listInventorySchema } from '@/models/pos/list-inventory';
import { useMemo } from 'react';

export function useInfiniteInventoryItems({ keyword }: { keyword: string | null }) {
  const { data, ...rest } = api.pos.inventory.infinite.useInfiniteQuery({ keyword }, { getNextPageParam: (lastPage) => lastPage.nextCursor });
  const parsedData = useMemo(() => ({
    items: data?.pages.flatMap(page => page.items.map(item => listInventorySchema.parse(item))),
  }), [data?.pages]);

  return { data: parsedData, ...rest };
}