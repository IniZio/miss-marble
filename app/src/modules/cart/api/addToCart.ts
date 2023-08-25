import { api } from '@/lib/utils/api';
import { type LineItem } from '@/models/cart';
import { useCallback } from 'react';
import { useLocalStorage } from 'react-use';

export function useAddToCart() {
  const [cartId, setCartId] = useLocalStorage<string | null>('cartId', null);

  const createCart = api.cart.create.useMutation();
  const { data: cart } = api.cart.get.useQuery(cartId!, { enabled: !!cartId });

  const addToCart = useCallback(async (lineItem: LineItem) => {
    if (cart) {
      throw new Error('Not Implemented');
    }

    const newCart = await createCart.mutateAsync({
      items: [lineItem],
      currencyCode: 'hkd',
    });
    setCartId(newCart.id);
  }, [cart, createCart, setCartId]);


  return [addToCart] as const;
}