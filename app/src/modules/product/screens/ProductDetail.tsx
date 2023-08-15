import React from 'react';
import Image from 'next/image';
import StorefrontLayout from '@/layouts/Storefronts';
import { prefetchProductDetail, useProductDetail } from '../api/getProductDetail';
import { type ServerSideHelpers } from '@/lib/utils/createServerSideHelpers';
import { cn } from '@/lib/utils/ui';
import Translated from '@/components/Translated';

export const prefetch = async (helpers: ServerSideHelpers, productId: string) => {
  await prefetchProductDetail(helpers, productId);
}

const ProductDetailScreen: React.FC<{productId: string}> = ({ productId }) => {
  const { data: productDetail } = useProductDetail(productId)

  return (
    <StorefrontLayout>
      <div className="md:mx-4 rounded-lg border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-black md:p-12 lg:flex-row lg:gap-8">
        <div className="mx-auto flex space-x-4 justify-center">
          <Image
            className={cn('relative object-contain')}
            src={productDetail.image?.url ?? ""}
            alt=""
            width={500}
            height={500}
          />
          <div className="flex-1">
            <div className="pb-2 border-b">
              <h1 className="mb-2 text-4xl font-medium"><Translated t={productDetail.name} /></h1>
            </div>

          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}

export default ProductDetailScreen