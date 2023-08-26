import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Cake, ShoppingCart, X } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useCartStore } from '../actions/cart';
import Translated from '@/components/Translated';
import { cn } from '@/lib/utils/ui';
import { Controller, useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { useShippingOptions } from '../actions/getShippingOptions';
import { Separator } from '@/components/ui/separator';
import ShippingOptionsSelect from './ShippingOptionsSelect';

const ViewShoppingCartButton: React.FC = () => {
  const [stage, setStage] = React.useState<'cart' | 'checkout'>('cart');
  const { cart, removeLineItem } = useCartStore();
  const { data: shippingOptions } = useShippingOptions();

  useEffect(() => {
    if (cart?.items.length ?? 0 === 0) {
      setStage('cart');
    }
  }, [cart])

  // Delivery
  const { register, control, handleSubmit } = useForm();

  const onSubmit = React.useCallback((data: unknown) => {
    console.log('=== submit', data);
  }, []);

  return (
    <Sheet onOpenChange={(open) => { if (!open) setStage('cart') }}>
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
      <SheetContent className={cn("w-full max-w-[100vw] transition-[min-width]", stage === "checkout" ? "min-w-[800px]" : 'min-w-[400px]')}>
        <SheetHeader>
          <SheetTitle>
            <FormattedMessage id="shoppingCart.sheet.title" defaultMessage="購物車" />
          </SheetTitle>
        </SheetHeader>
        <div className="flex gap-x-4 h-[calc(100%-100px)]">
          {stage === 'checkout' && (
            <div className="flex-1">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4 py-4">
                  <h3 className="font-bold"><FormattedMessage id="shoppingCart.sheet.checkout.contact" defaultMessage="聯絡方法" /></h3>
                  <div>
                    <Label>
                      <FormattedMessage id="shoppingCart.sheet.checkout.name" defaultMessage="姓名" />
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input {...register('name', { required: true })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>
                        <FormattedMessage id="shoppingCart.sheet.checkout.phone" defaultMessage="電話" />
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input {...register('phoneNumber', { required: true })} />
                    </div>
                    <div>
                      <Label>
                        <FormattedMessage id="shoppingCart.sheet.checkout.socialHandle" defaultMessage="IG/FB 名稱" />
                      </Label>
                      <Input {...register('socialHandle')} />
                    </div>
                  </div>
                  <Separator />
                  <h3 className="font-bold"><FormattedMessage id="shoppingCart.sheet.checkout.delivery" defaultMessage="送貨方式" /></h3>
                  <div>
                    <Label>
                      <FormattedMessage id="shoppingCart.sheet.checkout.address" defaultMessage="地址" />
                      <span className="text-destructive">*</span>
                    </Label>
                    <Controller control={control} name="shippingOption" render={({field}) => (
                      <ShippingOptionsSelect options={shippingOptions ?? []} {...field} className="mt-1 w-full" />
                    )} />
                  </div>
                  <div>
                    <Label>
                      <FormattedMessage id="shoppingCart.sheet.checkout.address" defaultMessage="地址" />
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input className="mt-1" {...register('address1', { required: true })} />
                    <Input className="mt-2" {...register('address2', { required: true })} />
                  </div>
                  <div>
                    <Label>
                      <FormattedMessage id="shoppingCart.sheet.checkout.remark" defaultMessage="備註" />
                    </Label>
                    <Textarea className="mt-1" {...register('remark', { required: true })} />
                  </div>
                </div>
              </form>
            </div>
          )}
          <div className={cn(stage === "checkout" && "w-100 border-l", "pl-4 h-full")}>
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
          </div>
        </div>
        <div className="absolute bottom-6 inset-x-6">
          <Button size="lg" className="w-full" onClick={() => setStage('checkout')}>
            <FormattedMessage id="shoppingCart.sheet.checkout" defaultMessage="進行結賬" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ViewShoppingCartButton