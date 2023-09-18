import Image from "next/image"
import { type PropsWithChildren } from "react";

import { Breadcrumb } from "../components/breadcrumb";
import { Menu } from "./menu";
import { MainNav } from './main-nav';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export const AdminLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/dashboard-light.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="block dark:hidden"
        />
        <Image
          src="/examples/dashboard-dark.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              {/* TODO: Profile menu */}
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">

          {children}
        </div>
      </div>
    </>
  )
}
