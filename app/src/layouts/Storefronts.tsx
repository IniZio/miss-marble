import { MainNav } from '@/components/MainNav';
import React, { type PropsWithChildren, Suspense } from 'react';

const StorefrontLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex h-screen flex-col bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
      <div className="flex flex-shrink-0 h-[76px] items-center px-4">
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
        </div>
      </div>
      <Suspense>
        <main className="flex-1 min-h-0">{children}</main>
      </Suspense>
    </div>
  );
}

export default StorefrontLayout