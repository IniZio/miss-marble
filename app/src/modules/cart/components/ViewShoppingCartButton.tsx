import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Cake, ShoppingCart, X } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useCartStore } from '../actions/cart';
import Translated from '@/components/Translated';

const ViewShoppingCartButton: React.FC = () => {
  const { cart, removeLineItem } = useCartStore();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          {(cart?.items.length ?? 0) > 0 && (
            <span className="rounded-full bg-black text-white text-xs w-5 h-5 flex items-center justify-center opacity-50 absolute right-0 top-0 translate-x-1/2 -translate-y-1/2">
              {(cart?.items.length ?? 0) > 9 ? '9+' : cart?.items.length}
            </span>
          )}
          <ShoppingCart size={16} />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full">
        <SheetHeader>
          <SheetTitle>
            <FormattedMessage id="shoppingCart.sheet.title" defaultMessage="購物車" />
          </SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {cart?.items.map((item) => {
            const image = item.product.gallery[0];

            return (
              <div key={item.id} className="grid grid-cols-4 space-x-4 px-1 py-4 border-b">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  {image ? (
                    <Image src={image.url} alt="" width={80} height={80} />
                  ) : (
                    <div className="flex items-center justify-center">
                      <Cake size={20} />
                    </div>
                  )}
                  <button
                    className="rounded-full bg-black w-4 h-4 flex items-center justify-center opacity-50 absolute right-0 top-0 translate-x-1/2 -translate-y-1/2"
                    onClick={() => removeLineItem(item.id)}
                  >
                    <X size={12} color='white' />
                  </button>
                </div>
                <div className="grid grid-cols-4 col-span-3">
                  <div className="col-span-3">
                    <Label className="font-bold text-lg"><Translated t={item.product.name} /></Label>
                  </div>
                  <span className="text-sm">{cart.currency.symbol}{item.total}</span>
                </div>
              </div>
            )
          })}
        </div>
        <SheetFooter className="absolute bottom-6 inset-x-6">
          <Button size="lg" className="w-full"><FormattedMessage id="shoppingCart.sheet.checkout" defaultMessage="進行結賬" /></Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default ViewShoppingCartButton