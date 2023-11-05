import { createServerSideHelpers } from '@/lib/createServerSideHelpers';
import { NextPageWithLayout } from '@/lib/types';
import InventoryListScreen from '@/modules/pos/modules/inventory/screens/InventoryList.screen';
import HomeScreen from '@/modules/pos/screens/Home.screen';
import { type NextPage, type GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

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

const InventoryListPage: NextPage = () => {
  const router = useRouter()

  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.pos.json" />
      </Head>
      <InventoryListScreen />
    </>
  );
}

export default InventoryListPage;