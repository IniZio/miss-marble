import { type PropsWithChildren, createContext, useMemo, useState, useEffect, useRef } from 'react';
import { useLocalStorage } from 'react-use';

interface CartContextType {
  cartId: string | null;
  setCartId: (cartId: string | null) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const CartContext = createContext<CartContextType>({ cartId: null, setCartId: () => {} });

export const CartProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [storedCartId, storeCartId] = useLocalStorage<string | null>('cartId', null);

  const initializedCart = useRef(false);
  const [cartId, setCartId] = useState<string | null>(null);

  useEffect(() => {
    if (!initializedCart.current) {
      initializedCart.current = true;
      setCartId(storedCartId ?? null);
      return;
    }

    storeCartId(cartId);
  }, [cartId, storeCartId, storedCartId]);

  const value = useMemo(() => ({ cartId, setCartId }), [cartId, setCartId]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}