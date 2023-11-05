import React, { useEffect, useState } from 'react';
import { NextPageWithLayout } from '@/lib/types';
import Translated from '@/components/Translated';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { type ColumnDef } from "@tanstack/react-table"
import { FormattedMessage } from 'react-intl';
import { type Translation } from '@/models/translation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, StoreIcon, WarehouseIcon } from 'lucide-react';
import { useInfiniteInventoryItems } from '../actions/getInventoryItems';
import { type ListInventory } from '@/models/pos/list-inventory';
import { DataTable } from '@/modules/admin/modules/product/components/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import Spinner from '@/components/ui/spinner';
import { cn } from '@/lib/ui';
import {Image} from 'lightbox.js-react'
import 'lightbox.js-react/dist/index.css'
import { Routes } from 'generated';

const columns: ColumnDef<ListInventory>[] = [
  {
    id: 'name',
    accessorFn: (row) => row,
    header: () => <FormattedMessage id="pos.inventoryList.header.name" defaultMessage="Name" />,
    cell: ({ cell }) => <Button variant="link">{cell.getValue<ListInventory>().name}</Button>,
    size: 75,
  },
  {
    accessorKey: "thumbnail.url",
    header: () => <FormattedMessage id="pos.inventoryList.header.thumbnail" defaultMessage="Thumbnail" />,
    cell: ({ cell }) => cell.getValue<string | undefined>() && <Image alt="product" src={cell.getValue<string>()} height={64} width={64} />,
  },
]

const InventoryListScreen: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const { data: { items: inventoryItems }, isFetched, isFetching, fetchNextPage, hasNextPage } = useInfiniteInventoryItems({ keyword });

  const [infiniteScrollRef] = useInfiniteScroll({
    loading: isFetching,
    hasNextPage: !!hasNextPage,
    onLoadMore: fetchNextPage,
    // // When there is an error, we stop infinite loading.
    // // It can be reactivated by setting "error" state as undefined.
    // disabled: !!error,
    // `rootMargin` is passed to `IntersectionObserver`.
    // We can use it to trigger 'onLoadMore' when the sentry comes near to become
    // visible, instead of becoming fully visible on the screen.
    rootMargin: '0px 0px 400px 0px',
  });

  return (
    <div className="flex flex-col h-screen">
      <Tabs defaultValue="inventory" className="m-4 mb-0">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="home" asChild>
            <Link href={Routes.PosHomePage()}>
              <StoreIcon className="mr-2" size={16} />
              訂單
            </Link>
          </TabsTrigger>
          <TabsTrigger value="inventory" asChild>
            <Link href={Routes.InventoryListPage()}>
              <WarehouseIcon className="mr-2" size={16} />
              貨存
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex-1 flex-col flex h-full max-h-full overflow-auto">
        <div className="p-4 space-y-4">
          <Input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="搜尋" />
        </div>
        <div className="px-4">
            {isFetched ? (
              <div>
                <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {inventoryItems?.map((inventoryItem) => (
                      <Card key={inventoryItem.sku} className="h-20">
                        <CardContent className="relative h-full w-full p-0">
                          <div className="flex items-center h-full space-x-4">
                            {inventoryItem.thumbnail?.url && (
                              <div className="flex items-center w-20 h-20 rounded-l-md overflow-hidden">
                                <Image
                                  alt={inventoryItem.name}
                                  image={{src: inventoryItem.thumbnail.url, title: inventoryItem.name}}
                                  modalClose="clickOutside"
                                  showFullScreenIcon={false}
                                />
                              </div>
                              )}
                            <div className={cn("flex flex-1 flex-col py-3", !inventoryItem.thumbnail?.url && "pl-6")}>
                              <span className="text-sm font-medium">{inventoryItem.name}</span>
                            </div>
                            <div className="px-6 text-right">
                              {inventoryItem.inventoryLevels?.map((inventoryLevel) => (
                                <div key={inventoryLevel.name}>
                                  <span className="text-sm font-semibold text-gray-500">
                                    {inventoryLevel.name}
                                  </span>
                                  <br />
                                  <span className={cn(
                                    "text-sm font-semibold text-gray-500",
                                    inventoryLevel.quantity <= inventoryLevel.safeQuantity && "text-red-500"
                                  )}>
                                    {inventoryLevel.quantity} {inventoryLevel.unit}
                                  </span>
                                  {/* <span className="ml-2 text-sm font-semibold text-gray-500">
                                    ({inventoryLevel.safeQuantity} {inventoryLevel.unit})
                                  </span> */}
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {(isFetching || hasNextPage) && (
                    <div className="w-full py-6 flex items-center justify-center" ref={infiniteScrollRef}>
                        <Spinner />
                    </div>
                    )}
              </div>
            ) : (
              <div className="w-full py-6 flex items-center justify-center" ref={infiniteScrollRef}>
                  <Spinner />
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default InventoryListScreen