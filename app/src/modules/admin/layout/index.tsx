import Image from "next/image"
import { type PropsWithChildren } from "react";

import { MainNav } from './main-nav';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SidebarNav } from './side-nav';
import { Toaster } from '@/components/ui/toaster';
import { Routes } from 'generated';

const sidebarNavItems = [
  {
    title: "Products",
    href: Routes.AdminProductsPage(),
  },
  {
    title: "Product Fields",
    href: Routes.AdminProductFieldListPage(),
  }
]

export const AdminLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <div className="flex-col flex h-screen">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              {/* TODO: Profile menu */}
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 p-2 sm:p-8 h-full overflow-y-auto">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 px-4">{children}</div>
        </div>
      </div>
      <Toaster />
    </>
  )
}
