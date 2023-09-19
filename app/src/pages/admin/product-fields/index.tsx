import { createServerSideHelpers } from '@/lib/createServerSideHelpers';
import { type NextPageWithLayout } from '@/lib/types';
import { NextPage, type GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { AdminLayout } from '@/modules/admin/layout';
import ProductListScreen from '@/modules/admin/modules/product/screens/ProductList.screen';
import ProductFieldListScreen from '@/modules/admin/modules/productField/screens/ProductFieldList.screen';

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

const AdminProductFieldListPage: NextPageWithLayout = () => {
  const router = useRouter()

  return (
    <ProductFieldListScreen />
  );
}

AdminProductFieldListPage.Layout = AdminLayout

export default AdminProductFieldListPage;