import { createServerSideHelpers } from '@/lib/createServerSideHelpers';
import { type NextPageWithLayout } from '@/lib/types';
import { AdminLayout } from '@/modules/admin/layout';
import { prefetchProductDetail } from '@/modules/product/api/getProductDetail';
import ProductDetailScreen from '@/modules/admin/modules/product/screens/ProductDetail.screen';
import { type GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import ProductFieldDetailScreen from '@/modules/admin/modules/productField/screens/ProductFieldDetail.screen';
import CreateProductField from '@/modules/admin/modules/productField/screens/CreateProductField.screen';
import CreateProductFieldScreen from '@/modules/admin/modules/productField/screens/CreateProductField.screen';

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

const AdminCreateProductFieldPage: NextPageWithLayout = () => {
  const router = useRouter()

  return (
    <CreateProductFieldScreen />
  );
}

AdminCreateProductFieldPage.Layout = AdminLayout

export default AdminCreateProductFieldPage;