import { type Metadata } from "next"

import { MainNav } from "@/components/MainNav"
import { api } from '@/lib/utils/api'

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
}

export default function DashboardPage() {
  const { data: products } = api.product.paginate.useInfiniteQuery({}, { getNextPageParam: (lastPage) => lastPage.nextCursor });
  // console.log(products?.pages.flatMap((page) => page.items))

  return (
    <>
      <div className="flex-col :flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <div className="flex items-center space-x-2">
              <pre className="w-full h-200">{JSON.stringify(products?.pages.flatMap((page) => page.items), null, 4)}</pre>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}