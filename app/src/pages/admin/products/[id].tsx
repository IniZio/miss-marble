import { createServerSideHelpers } from '@/lib/createServerSideHelpers';
import { type NextPageWithLayout } from '@/lib/types';
import { AdminLayout } from '@/modules/admin/layout';
import { prefetchProductDetail } from '@/modules/product/api/getProductDetail';
import ProductDetailScreen from '@/modules/admin/screens/products/ProductDetail.screen';
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

const AdminProductDetailPage: NextPageWithLayout = () => {
  const router = useRouter()

  return (
    <ProductDetailScreen productId={router.query.id as string} />
  );
}

AdminProductDetailPage.Layout = AdminLayout

export default AdminProductDetailPage;