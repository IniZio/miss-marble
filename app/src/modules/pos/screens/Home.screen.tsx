import React, { useCallback, useEffect, useState } from 'react';
import { useGetOrders } from '../actions/getOrders';
import { type DateRange } from 'react-day-picker';
import { FormattedMessage } from 'react-intl';
import { Label } from '@/components/ui/label';
import { DateRangePicker } from '@/components/ui/daterange-picker';
import { Input } from '@/components/ui/input';
import dayjs from 'dayjs';
import { ArrowLeftIcon, ArrowRight, ArrowRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OrderStats from '../components/OrderStats';
import { getSupabase } from '@/clients/supabase';
import OrderCard from '../components/OrderCard';
import { DatePicker } from '@/components/ui/date-picker';

const HomeScreen: React.FC = () => {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(() => ({
    from: dayjs(new Date()).startOf('day').toDate(),
    to: dayjs(new Date()).endOf('day').toDate(),
  }));
  const [keyword, setKeyword] = useState('');
  const { data: orders, isLoading } = useGetOrders({
    dateStart: dayjs(dateRange?.from ?? dateRange?.to ?? new Date()).startOf('day').toDate(),
    dateEnd: dayjs(dateRange?.to ?? dateRange?.from ?? new Date()).endOf('day').toDate(),
    keyword
  });

  const [orderAssets, setOrderAssets] = useState<string[]>([])
  const refreshOrderAssets = useCallback(() => {
    return getSupabase().storage
      .from("order-assets")
      .list(undefined, {
        limit: 200,
        offset: 0,
        sortBy: { column: "updated_at", order: "desc" },
      })
      .then(({ data }) => data && setOrderAssets(data.map((i) => i.name)))
  }, [])
  useEffect(() => {
    void refreshOrderAssets()
  }, [refreshOrderAssets])


  return (
    <div className="flex-col flex h-screen">
      <div className="p-4 space-y-4">
        <Input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="搜尋電話 / 姓名" />
        <div className="flex space-x-2 items-center">
          <Button variant="outline"
            className="w-9 px-0 flex-shrink-0"
            onClick={() => setDateRange({
              from: dayjs(dateRange?.from).subtract(1, 'day').toDate(),
              to: dayjs(dateRange?.to).subtract(1, 'day').toDate()
            })}
          >
            <ArrowLeftIcon
              className="h-5 w-5 cursor-pointer"

            />
          </Button>
          <DatePicker
            className="w-full"
            value={dateRange?.from}
            onChange={date => setDateRange({
              from: dayjs(date).startOf('day').toDate(),
              to: dayjs(date).endOf('day').toDate()
            })}
          />
          <Button variant="outline"
            className="w-9 px-0 flex-shrink-0"
            onClick={() => setDateRange({
                from: dayjs(dateRange?.from).add(1, 'day').toDate(),
                to: dayjs(dateRange?.to).add(1, 'day').toDate()
              })}>
            <ArrowRightIcon
              className="h-5 w-5 cursor-pointer"
            />
          </Button>
        </div>
      </div>
      <div className="px-4">
        <OrderStats orders={orders} isLoading={isLoading} />
      <div className="mt-2 flex gap-2 pb-3">
        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {orders?.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              orderAssets={orderAssets.filter(
                (asset) =>
                  order.createdAt?.toISOString() &&
                  (asset === order.createdAt?.toISOString() ||
                    asset.startsWith(`${order.createdAt?.toISOString()}-`))
              )}
              onUpdate={refreshOrderAssets}
            />
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}

export default HomeScreen