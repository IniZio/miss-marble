import { createServerSideHelpers } from '@/lib/createServerSideHelpers';
import { prefetchProductDetail } from '@/modules/product/api/getProductDetail';
import ProductDetailScreen from '@/modules/product/screens/ProductDetail';
import { type GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

export async function getServerSideProps(
  context: GetServerSidePropsContext
) {
  const serverSideHelpers = await createServerSideHelpers(context);

  const productId = context.params?.id as string;
  await prefetchProductDetail(serverSideHelpers, productId);

  return {
    props: {
      trpcState: serverSideHelpers.dehydrate(),
    }
  }
}

const ProductDetailPage: React.FC = () => {
  const router = useRouter()

  return (
    <ProductDetailScreen productId={router.query.id as string} />
  );
}

export default ProductDetailPage;