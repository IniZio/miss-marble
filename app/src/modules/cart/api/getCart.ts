import { api } from '@/lib/utils/api';
import { useLocalStorage } from 'react-use';

export function useGetCart() {
  const [cartId] = useLocalStorage<string | null>('cartId', null);

  return api.cart.get.useQuery(cartId!, { enabled: !!cartId });
}