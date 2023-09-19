import { api } from '@/lib/api';
import { type ServerSideHelpers } from '@/lib/createServerSideHelpers';
import { apiAdminProductSchema } from '@/models/admin/product';
import { apiShippingOptionSchema } from '@/models/shipping';
import { useMemo } from 'react';
import { z } from 'zod';
import { listAdminProductFieldSchema } from '../models/productFIeld';

export function useGetProductFields({ pageIndex, pageSize }: { pageIndex: number, pageSize: number }) {
  const { data, ...rest } = api.admin.productField.paginate.useQuery({
    pageIndex,
    pageSize,
  }, {
    keepPreviousData: true,
  });
  const parsedData = useMemo(() => ({
    items: data?.items.map(p => listAdminProductFieldSchema.parse(p)),
    pageCount: data?.pageCount,
    totalCount: data?.totalCount,
  }), [data?.items, data?.pageCount, data?.totalCount]);

  return { data: parsedData, ...rest };
}