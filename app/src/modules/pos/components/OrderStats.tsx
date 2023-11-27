import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import Spinner from '@/components/ui/spinner'
import { OrderPaymentStatus, type ListOrder } from '@/models/pos/list-order'
import { type Order } from '@prisma/client'

export interface OrderStatsProps {
  orders?: ListOrder[]
  isLoading: boolean
}

function OrderStats({ orders, isLoading }: OrderStatsProps) {
  return (
    <Card>
      <CardContent className="pt-4">
        <h3 className="font-bold">已付訂單數</h3>
        <div>{isLoading ? <Spinner /> : orders?.filter(order => order.paymentStatus === OrderPaymentStatus.CAPTURED)?.length}</div>
      </CardContent>
    </Card>
  )
}

export default OrderStats
