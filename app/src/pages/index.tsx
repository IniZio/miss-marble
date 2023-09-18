import { type GetServerSidePropsContext } from "next"
import { createServerSideHelpers } from '@/lib/createServerSideHelpers';
import HomeScreen, { prefetch as prefetchHomeScreen } from '@/modules/homepage/screens/HomeScreen';

export async function getServerSideProps(
  context: GetServerSidePropsContext
) {
  const serverSideHelpers = await createServerSideHelpers(context);

  await prefetchHomeScreen(serverSideHelpers);

  return {
    props: {
      trpcState: serverSideHelpers.dehydrate(),
    }
  }
}

export default function IndexPage() {
  return (
    <HomeScreen />
  )
}