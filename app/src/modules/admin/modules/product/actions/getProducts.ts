import { api } from '@/lib/api';
import { type ServerSideHelpers } from '@/lib/createServerSideHelpers';
import { apiAdminProductSchema } from '@/models/admin/product';
import { apiShippingOptionSchema } from '@/models/shipping';
import { useMemo } from 'react';
import { z } from 'zod';
import { listAdminProductSchema } from '../models/product';

export function useGetProducts({ pageIndex, pageSize }: { pageIndex: number, pageSize: number }) {
  const { data, ...rest } = api.admin.product.paginate.useQuery({
    pageIndex,
    pageSize,
  }, {
    keepPreviousData: true,
  });
  const parsedData = useMemo(() => ({
    items: data?.items.map(p => listAdminProductSchema.parse(p)),
    pageCount: data?.pageCount,
    totalCount: data?.totalCount,
  }), [data?.items, data?.pageCount, data?.totalCount]);

  return { data: parsedData, ...rest };
}