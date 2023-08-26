import { type PropsWithChildren, createContext, useMemo, useState } from 'react';

interface CartContextType {
  cartId: string | null;
  setCartId: (cartId: string | null) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const CartContext = createContext<CartContextType>({ cartId: null, setCartId: () => {} });

export const CartProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [cartId, setCartId] = useState<string | null>(null);
  const value = useMemo(() => ({ cartId, setCartId }), [cartId, setCartId]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}