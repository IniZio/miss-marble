import React, { useEffect, useState } from 'react';
import { NextPageWithLayout } from '@/lib/types';
import { AdminLayout } from '../../../layout';
import Translated from '@/components/Translated';

import { type ColumnDef } from "@tanstack/react-table"
import { ListAdminProductField } from '../models/productFIeld';
import { FormattedMessage } from 'react-intl';
import { type Translation } from '@/models/translation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Routes } from 'generated';
import { Plus } from 'lucide-react';
import { ModuleHeader, ModuleHeaderActions, ModuleHeaderTitle } from '../../../components/module-header';
import { ProductFieldType } from '@/models/admin/productField';
import { useGetProductFields } from '../actions/getProductFields';
import { DataTable } from '../../product/components/DataTable';

const columns: ColumnDef<ListAdminProductField>[] = [
  {
    id: 'name',
    accessorFn: (row) => row,
    header: () => <FormattedMessage id="admin.productFieldList.header.name" defaultMessage="Name" />,
    cell: ({ cell }) => <Button variant="link" asChild><Link href={Routes.AdminProductFieldDetailPage({ id: cell.getValue<ListAdminProductField>?.().id })}><Translated t={cell.getValue<ListAdminProductField>().name} /></Link></Button>,
    size: 75,
  },
  {
    accessorKey: "alias",
    header: () => <FormattedMessage id="admin.productFieldList.header.alias" defaultMessage="Alias" />,
    // cell: ({ cell }) => <Image alt="product" src={cell.getValue<string>()} height={64} width={64} />,
    size: 50,
  },
  {
    accessorKey: "type",
    header: () => <FormattedMessage id="admin.productFieldList.header.type" defaultMessage="Type" />,
    // cell: ({ cell }) => <Image alt="product" src={cell.getValue<ProductFieldType>()} height={64} width={64} />,
  },
]

const ProductFieldListScreen: React.FC = () => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const { data: productFieldsPage } = useGetProductFields(pagination);

  return (
    <div>
      <ModuleHeader>
        <ModuleHeaderTitle>Product Fields</ModuleHeaderTitle>
        <ModuleHeaderActions>
          <Button asChild>
            <Link href={Routes.AdminCreateProductFieldPage()}>
              <Plus width={16} height={16} /> Create
            </Link>
          </Button>
        </ModuleHeaderActions>
      </ModuleHeader>
      <div className="mt-4 max-w-2xl">
        {productFieldsPage.items ? (
          <DataTable
            columns={columns}
            data={productFieldsPage.items}
            pageCount={productFieldsPage.pageCount}
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

export default ProductFieldListScreen