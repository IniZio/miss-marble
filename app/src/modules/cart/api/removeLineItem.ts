import { api } from '@/lib/utils/api';
import { type LineItem } from '@/models/cart';
import { useCallback } from 'react';
import { useLocalStorage } from 'react-use';

export function useRemoveLineItem() {
  const [cartId, setCartId] = useLocalStorage<string | null>('cartId', null);

  const deleteCart = api.cart.delete.useMutation();
  const { data: cart, remove: removeCart } = api.cart.get.useQuery(cartId!, { enabled: !!cartId });

  const removeLineItem = useCallback(async (lineItemId: string) => {
    if (!cart) {
      return;
    }

    if (cart.items.length <= 1) {
      await deleteCart.mutateAsync(cart.id);
      removeCart();
      setCartId(null);
      return;
    }
  }, [cart, deleteCart, removeCart, setCartId]);


  return [removeLineItem] as const;
}