import Image from "next/image"
import { type PropsWithChildren } from "react";

import { MainNav } from './main-nav';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SidebarNav } from './side-nav';
import { Toaster } from '@/components/ui/toaster';
import { Routes } from 'generated';
import Head from 'next/head';
import { MenuSquareIcon, PackageIcon } from 'lucide-react';

const sidebarNavItems = [
  {
    icon: <PackageIcon size={18} />,
    title: "Products",
    href: Routes.AdminProductsPage(),
  },
  {
    icon: <MenuSquareIcon size={18} />,
    title: "Product Options",
    href: Routes.AdminProductFieldListPage(),
  }
]

export const AdminLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.admin.json" />
      </Head>
      <div className="flex h-screen">
        <aside className="w-80">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 p-2 sm:p-8 h-full overflow-y-auto bg-gray-50 w-full shadow-inner">
          <div className="flex-1 px-4">{children}</div>
        </div>
      </div>
      <Toaster />
    </>
  )
}
