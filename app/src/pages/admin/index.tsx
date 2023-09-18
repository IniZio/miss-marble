import { createServerSideHelpers } from '@/lib/createServerSideHelpers';
import { type NextPageWithLayout } from '@/lib/types';
import { NextPage, type GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { AdminLayout } from '@/modules/admin/layout';

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

const AdminIndexPage: NextPageWithLayout = () => {
  const router = useRouter()

  return (
    <h1>Hello</h1>
  );
}

AdminIndexPage.Layout = AdminLayout

export default AdminIndexPage;