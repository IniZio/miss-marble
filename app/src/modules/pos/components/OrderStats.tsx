import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import Spinner from '@/components/ui/spinner'
import { type Order } from '@prisma/client'

export interface OrderStatsProps {
  orders?: Order[]
  isLoading: boolean
}

function OrderStats({ orders, isLoading }: OrderStatsProps) {
  return (
    <Card>
      <CardContent className="pt-4">
        <h3 className="font-bold">訂單數</h3>
        <div>{isLoading ? <Spinner /> : orders?.length}</div>
      </CardContent>
    </Card>
  )
}

export default OrderStats
