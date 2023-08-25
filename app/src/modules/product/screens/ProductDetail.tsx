import React from 'react';
import Image from 'next/image';
import StorefrontLayout from '@/layouts/Storefronts';
import { prefetchProductDetail, useProductDetail } from '../api/getProductDetail';
import { type ServerSideHelpers } from '@/lib/utils/createServerSideHelpers';
import { cn } from '@/lib/utils/ui';
import Translated from '@/components/Translated';
import ProductFieldForm, { ProductFieldValues } from '../components/ProductFieldForm/ProductFieldForm';
import { Separator } from '@/components/ui/separator';
import { useAddToCart } from '../../cart/api/addToCart';

export const prefetch = async (helpers: ServerSideHelpers, productId: string) => {
  await prefetchProductDetail(helpers, productId);
}

const ProductDetailScreen: React.FC<{productId: string}> = ({ productId }) => {
  const { data: productDetail } = useProductDetail(productId)
  const [addToCart] = useAddToCart();

  const handleAddToCart = async (values: ProductFieldValues) => {
    await addToCart({
      productId,
      quantity: 1,
    });
  }

  if (productDetail === null) {
    return null;
  }

  return (
    <StorefrontLayout>
      <div className="max-w-5xl mx-2 md:mx-auto rounded-lg border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-black md:p-12 lg:flex-row lg:gap-8">
        <div className="mx-auto flex sm:flex-row flex-col sm:space-x-12 space-y-6 justify-center">
          <Image
            className={cn('flex-1 relative object-contain')}
            src={productDetail.image?.url ?? ""}
            alt=""
            width={500}
            height={500}
          />
          <div className="w-80 max-w-full">
            <h1 className="mb-2 text-4xl font-medium"><Translated t={productDetail.name} /></h1>
            <Separator className="my-4" />
            <ProductFieldForm fields={productDetail.fields} onAddToCart={handleAddToCart} />
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}

export default ProductDetailScreen