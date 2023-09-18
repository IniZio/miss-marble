import React, { useCallback } from 'react';
import Image from 'next/image';
import StorefrontLayout from '@/layouts/Storefronts';
import { prefetchProductDetail, useProductDetail } from '../api/getProductDetail';
import { type ServerSideHelpers } from '@/lib/createServerSideHelpers';
import { cn } from '@/lib/ui';
import Translated from '@/components/Translated';
import ProductFieldForm, { type ProductFieldValues } from '../components/ProductFieldForm/ProductFieldForm';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '../../cart/actions/cart';
import { type AssetUpload } from '@/models/asset';

export const prefetch = async (helpers: ServerSideHelpers, productId: string) => {
  await prefetchProductDetail(helpers, productId);
}

const ProductDetailScreen: React.FC<{productId: string}> = ({ productId }) => {
  const { data: productDetail } = useProductDetail(productId)
  const { addToCart } = useCartStore();

  const handleAddToCart = useCallback(async (values: ProductFieldValues) => {
    const fieldValues =  Object.entries(values).reduce((acc, [fieldId, value]) => {
      const field = productDetail!.fields.find(field => field.id === fieldId)!;
      switch (field.type) {
        case 'TEXT':
          acc.push({
            fieldId,
            value: value as string,
          });
          break;
        case 'SELECT':
          acc.push({
            fieldId,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
            fieldOptionId: (value as any).value as string,
          });
          break;
        case 'CHECKBOXES':
          const _value = value as { selected: string[], otherSelected: boolean, other: string } | null;
          _value?.selected.forEach(val => acc.push({
            fieldId,
            fieldOptionId: val,
          }));
          if (_value?.otherSelected && _value?.other) {
            acc.push({
              fieldId,
              value: _value.other,
            });
          }
          break;
        case 'ASSET':
          acc.push({
            fieldId,
            asset: value as AssetUpload,
          });
          break;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return acc;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, [] as any[]);

    await addToCart({
      productId,
      productFieldValues: fieldValues,
      quantity: 1,
    });
  }, [addToCart, productDetail, productId])

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