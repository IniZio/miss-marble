import { api } from '@/lib/api';
import { type LineItem } from '@/models/cart';
import { useCallback, useContext, useEffect, useState } from 'react';
import { CartContext } from '../provider';

export type CartUpdate = Omit<Parameters<ReturnType<typeof api.cart.update.useMutation>['mutateAsync']>[0], 'cartId'>;

export function useCartStore() {
  const apiContext = api.useContext();

  const { cartId, setCartId } = useContext(CartContext);
  const { data: cart, remove: removeCart, refetch: refetchCart } = api.cart.get.useQuery(cartId!, { enabled: !!cartId });

  const createCart = api.cart.create.useMutation();
  const update = api.cart.update.useMutation();
  const addLineItem = api.cart.addLineItem.useMutation();
  const removeLineItem = api.cart.removeLineItem.useMutation();
  const complete = api.cart.complete.useMutation();

  const addToCart = useCallback(async (lineItem: LineItem) => {
    if (cartId) {
      const newCart = await addLineItem.mutateAsync({
        cartId,
        item: lineItem,
      });
      setCartId(newCart.id);
      apiContext.cart.get.setData(newCart.id, newCart);
      void refetchCart();
      return;
    }

    const newCart = await createCart.mutateAsync({
      items: [lineItem],
      currencyCode: 'hkd',
    });
    setCartId(newCart.id);
  }, [addLineItem, apiContext.cart.get, cartId, createCart, refetchCart, setCartId]);

  const updateCart = useCallback((cartUpdate: CartUpdate) => {
    if (!cart) {
      return;
    }

    return update.mutateAsync({
      cartId: cart.id,
      ...cartUpdate,
    }).then(() => refetchCart());
  }, [cart, refetchCart, update]);

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

  const completeCart = useCallback(() => {
    if (!cart) {
      return;
    }

    return complete.mutateAsync(cart.id).then(() => {
      removeCart();
      setCartId(null);
    });
  }, [cart, complete, removeCart, setCartId]);

  return { addToCart, cart, removeLineItem: deleteLineItem, completeCart, updateCart } as const;
}