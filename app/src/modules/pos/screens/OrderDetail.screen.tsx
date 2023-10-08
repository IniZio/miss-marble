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
import { useGetOrder } from '../actions/getOrder';
import Link from 'next/link';

export interface OrderDetailScreenProps {
  orderId: string;
}

const OrderDetailScreen: React.FC<OrderDetailScreenProps> = ({ orderId }) => {
  const { data: order, isLoading } = useGetOrder({ id: orderId });

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

  if (isLoading || !order) return null;

  return (
    <div className="flex-col flex h-screen">
      <div className="p-4 space-y-4">
          <Button variant="outline"
            className="w-9 px-0 flex-shrink-0"
            asChild
          >
            <Link href="/pos">
              <ArrowLeftIcon
                className="h-5 w-5 cursor-pointer"
              />
            </Link>
          </Button>
      </div>
      <div className="px-4">
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
      </div>
    </div>
  );
}

export default OrderDetailScreen