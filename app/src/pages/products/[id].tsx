import ProductDetailScreen from '@/modules/product/screens/ProductDetail';
import { useRouter } from 'next/router';
import React from 'react';

const ProductDetailPage: React.FC = () => {
  const router = useRouter()

  return (
    <ProductDetailScreen productId={router.query.id as string} />
  );
}

export default ProductDetailPage;