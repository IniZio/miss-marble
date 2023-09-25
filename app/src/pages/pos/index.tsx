import { createServerSideHelpers } from '@/lib/createServerSideHelpers';
import { NextPageWithLayout } from '@/lib/types';
import HomeScreen from '@/modules/pos/screens/Home.screen';
import { type NextPage, type GetServerSidePropsContext } from 'next';
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

const PosHomePage: NextPage = () => {
  const router = useRouter()

  return (
    <HomeScreen />
  );
}

export default PosHomePage;