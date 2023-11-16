import React, { useEffect, useState } from 'react';
import { useGetProducts } from '../actions/getProducts';
import { NextPageWithLayout } from '@/lib/types';
import { AdminLayout } from '../../../layout';
import Translated from '@/components/Translated';

import { type ColumnDef } from "@tanstack/react-table"
import { type ListAdminProduct } from '../models/product';
import { DataTable } from '../components/DataTable';
import { FormattedMessage } from 'react-intl';
import { type Translation } from '@/models/translation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Routes } from 'generated';
import { Plus } from 'lucide-react';
import { ModuleHeader, ModuleHeaderActions, ModuleHeaderTitle } from '../../../components/module-header';

const columns: ColumnDef<ListAdminProduct>[] = [
  {
    id: 'name',
    accessorFn: (row) => row,
    header: () => <FormattedMessage id="admin.productList.header.name" defaultMessage="Name" />,
    cell: ({ cell }) => <Button variant="link" asChild><Link href={Routes.AdminProductDetailPage({ id: cell.getValue<ListAdminProduct>?.().id })}><Translated t={cell.getValue<ListAdminProduct>().name} /></Link></Button>,
    size: 75,
  },
  {
    accessorKey: "image.url",
    header: () => <FormattedMessage id="admin.productList.header.image" defaultMessage="Gallery" />,
    cell: ({ cell }) => <Image alt="product" src={cell.getValue<string>()} height={64} width={64} />,
  },
]

const ProductListScreen: React.FC = () => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const { data: productsPage } = useGetProducts(pagination);

  return (
    <div>
      <ModuleHeader>
        <ModuleHeaderTitle>Products</ModuleHeaderTitle>
        <ModuleHeaderActions>
          <Button asChild>
            <Link href={Routes.AdminCreateProductPage()}>
              <Plus width={16} height={16} /> Create
            </Link>
          </Button>
        </ModuleHeaderActions>
      </ModuleHeader>
      <div className="mt-6">
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