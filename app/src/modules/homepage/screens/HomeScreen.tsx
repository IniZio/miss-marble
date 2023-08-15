import React from 'react';
import { ProductsGrid } from '../components/ProductsGrid';
import { type ServerSideHelpers } from '@/lib/utils/createServerSideHelpers';
import { prefetchRecommendedProducts, useRecommendedProducts } from '../api/getRecommendedProducts';
import StorefrontLayout from '@/layouts/Storefronts';

export const prefetch = async (helpers: ServerSideHelpers) => {
  await prefetchRecommendedProducts(helpers)
}

const HomeScreen: React.FC = () => {
  const { data: recommendedProducts } = useRecommendedProducts();
  if (!recommendedProducts) return null;

  return (
    <StorefrontLayout>
      <ProductsGrid products={recommendedProducts} />
    </StorefrontLayout>
  );
}

export default HomeScreen