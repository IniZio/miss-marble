import { api } from '@/lib/utils/api';
import { type LineItem } from '@/models/cart';
import { useCallback, useContext, useEffect, useState } from 'react';
import { CartContext } from '../provider';

export function useCartStore() {
  const apiContext = api.useContext();

  const { cartId, setCartId } = useContext(CartContext);
  const createCart = api.cart.create.useMutation();
  const addLineItem = api.cart.addLineItem.useMutation();
  const removeLineItem = api.cart.removeLineItem.useMutation();
  const { data: cart, remove: removeCart, refetch: refetchCart } = api.cart.get.useQuery(cartId!);

  const addToCart = useCallback(async (lineItem: LineItem) => {
    if (cartId) {
      const newCart = await addLineItem.mutateAsync({
        cartId,
        item: lineItem,
      });
      setCartId(newCart!.id);
      apiContext.cart.get.setData(newCart!.id, newCart);
      void refetchCart();
      return;
    }

    const newCart = await createCart.mutateAsync({
      items: [lineItem],
      currencyCode: 'hkd',
    });
    setCartId(newCart.id);
  }, [addLineItem, apiContext.cart.get, cartId, createCart, refetchCart, setCartId]);

  const deleteCart = api.cart.delete.useMutation();
  const deleteLineItem = useCallback((lineItemId: string) => {
    if (!cart) {
      return;
    }

    if (cart.items.length <= 1) {
      void deleteCart.mutateAsync(cart.id);
      removeCart();
      setCartId(null);
      return;
    }

    void removeLineItem.mutateAsync({
      cartId: cart.id,
      lineItemId,
    }).then(() => refetchCart());
  }, [cart, deleteCart, refetchCart, removeCart, removeLineItem, setCartId]);

  return { addToCart, cart, removeLineItem: deleteLineItem }
}