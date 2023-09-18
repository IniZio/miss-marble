import React, { useEffect, useState } from 'react';
import { useGetProducts } from '../actions/getProducts';
import { NextPageWithLayout } from '@/lib/types';
import { AdminLayout } from '../../layout';
import Translated from '@/components/Translated';

import { type ColumnDef } from "@tanstack/react-table"
import { type ListAdminProduct } from '../models/product';
import { DataTable } from '../components/DataTable';
import { FormattedMessage } from 'react-intl';
import { type Translation } from '@/models/translation';
import Image from 'next/image';

const columns: ColumnDef<ListAdminProduct>[] = [
  {
    accessorKey: 'name',
    header: () => <FormattedMessage id="admin.productList.header.name" defaultMessage="Name" />,
    cell: ({ cell }) => <Translated t={cell.getValue<Translation>()} />,
    size: 100,
  },
  {
    accessorKey: "image.url",
    header: () => <FormattedMessage id="admin.productList.header.image" defaultMessage="Gallery" />,
    cell: ({ cell }) => <Image alt="product" src={cell.getValue<string>()} height={64} width={64} />,
  },
]

const ProductListScreen: React.FC = () => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 1 });
  const { data: productsPage } = useGetProducts(pagination);

  return (
    <div>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <div className="flex items-center space-x-2">
        </div>
      </div>
      {/* <ul>
        {data?.map((product) => (
          <li key={product.id}>
            <h2><Translated t={product.name}/></h2>
            <p>{product.id}</p>
          </li>
        ))}
      </ul> */}
      <div className="mt-4">
        {productsPage.items ? (
          <DataTable
            columns={columns}
            data={productsPage.items}
            pageCount={productsPage.pageCount}
            pagination={pagination}
            onPaginationChange={setPagination}
          />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default ProductListScreen