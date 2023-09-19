import { createServerSideHelpers } from '@/lib/createServerSideHelpers';
import { type NextPageWithLayout } from '@/lib/types';
import { AdminLayout } from '@/modules/admin/layout';
import { prefetchProductDetail } from '@/modules/product/api/getProductDetail';
import ProductDetailScreen from '@/modules/admin/modules/product/screens/ProductDetail.screen';
import { type GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import ProductFieldDetailScreen from '@/modules/admin/modules/productField/screens/ProductFieldDetail.screen';

export async function getServerSideProps(
  context: GetServerSidePropsContext
) {
  const serverSideHelpers = await createServerSideHelpers(context);

  return {
    props: {
      trpcState: serverSideHelpers.dehydrate(),
    }
  }
}

const AdminProductFieldDetailPage: NextPageWithLayout = () => {
  const router = useRouter()

  return (
    <ProductFieldDetailScreen productFieldId={router.query.id as string} />
  );
}

AdminProductFieldDetailPage.Layout = AdminLayout

export default AdminProductFieldDetailPage;