import { createServerSideHelpers } from '@/lib/createServerSideHelpers';
import OrderDetailScreen from '@/modules/pos/screens/OrderDetail.screen';
import { prefetchProductDetail } from '@/modules/product/api/getProductDetail';
import ProductDetailScreen from '@/modules/product/screens/ProductDetail';
import { type GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

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

const OrderDetailPage: React.FC = () => {
  const router = useRouter()

  return (
    <OrderDetailScreen orderId={router.query.id as string} />
  );
}

export default OrderDetailPage;