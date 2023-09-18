import { createServerSideHelpers } from '@/lib/createServerSideHelpers';
import { type NextPageWithLayout } from '@/lib/types';
import { NextPage, type GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { AdminLayout } from '@/modules/admin/layout';
import ProductListScreen from '@/modules/admin/screens/products/ProductList.screen';

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

const AdminProductsPage: NextPageWithLayout = () => {
  const router = useRouter()

  return (
    <ProductListScreen />
  );
}

AdminProductsPage.Layout = AdminLayout

export default AdminProductsPage;