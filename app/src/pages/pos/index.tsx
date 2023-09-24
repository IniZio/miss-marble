import { NextPageWithLayout } from '@/lib/types';
import HomeScreen from '@/modules/pos/screens/Home.screen';
import { type NextPage, type GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';

const PosHomePage: NextPage = () => {
  const router = useRouter()

  return (
    <HomeScreen />
  );
}

export default PosHomePage;