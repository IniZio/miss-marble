/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/components/ui/use-toast"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Cake, ShoppingCart, X } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useCartStore } from '../actions/cart';
import Translated from '@/components/Translated';
import { cn } from '@/lib/ui';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { Textarea } from '@/components/ui/textarea';
import { useShippingOptions } from '../actions/getShippingOptions';
import { Separator } from '@/components/ui/separator';
import ShippingOptionsSelect from './ShippingOptionsSelect';
import { ProductField } from '@/models/product';
import { usePaymentOptions } from '../actions/getPaymentOptions';
import PaymentOptionsSelect from './PaymentOptionsSelect';
import { z } from 'zod';
import SocialChannelSelect from './SocialChannelSelect';
import { DatePicker } from '@/components/ui/date-picker';
import TimeslotsSelect from './TimeslotsSelect';
import dayjs from 'dayjs';

const CartUpdateSchema = z.object({
  name: z.string().nonempty(),
  phoneNumber: z.string().nonempty(),
  socialHandle: z.string().nonempty(),
  socialChannel: z.string().nonempty(),
  remark: z.string(),
  address1: z.string().nonempty(),
  address2: z.string(),
  paymentOption: z.string(),
  shippingOption: z.string(),
  deliveryDate: z.date(),
  deliveryHour: z.number(),
})

const ViewShoppingCartButton: React.FC = () => {
  const { toast } = useToast()
  const [stage, setStage] = React.useState<'cart' | 'checkout'>('cart');
  const { cart, removeLineItem, updateCart, completeCart } = useCartStore();
  const { data: shippingOptions } = useShippingOptions();
  const { data: paymentOptions } = usePaymentOptions();

  // Reset stage when cart is empty
  useEffect(() => {
    if (cart?.items.length === 0) {
      setStage('cart');
    }
  }, [cart])

  // Delivery
  const { register, reset, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<typeof CartUpdateSchema>>({ resolver: zodResolver(CartUpdateSchema) });
  const selectedPaymentOptionId = useWatch({ control, name: 'paymentOption' });
  const selectedPaymentOption = useMemo(() => paymentOptions?.find((paymentOption) => paymentOption.id === selectedPaymentOptionId), [paymentOptions, selectedPaymentOptionId]);

  const onSubmit = React.useCallback(async (data: z.infer<typeof CartUpdateSchema>) => {
    await updateCart({
      phoneNumber: data.phoneNumber,
      socialChannel: data.socialChannel,
      socialHandle: data.socialHandle,
      remark: data.remark,
      shippingAddress: {
        name: data.name,
        address1: data.address1,
        address2: data.address2,
      },
      shippingOptionId: data.shippingOption,
      paymentOptionId: data.paymentOption,
      deliveryDate: dayjs(data.deliveryDate).set('hour', data.deliveryHour).set('minute', 0).toDate()
    });
    await completeCart();
    setStage('cart');
    reset();
    toast({
      title: "訂單已送出！",
    })
  }, [completeCart, reset, toast, updateCart]);

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
      <SheetContent className={cn("!max-w-[100vw] transition-[width]", stage === "checkout" ? "w-[1000px]" : 'w-[400px]')}>
        <SheetHeader>
          <SheetTitle>
            <FormattedMessage id="shoppingCart.sheet.title" defaultMessage="購物車" />
          </SheetTitle>
        </SheetHeader>
        <form className="h-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col-reverse sm:flex-row h-[calc(100%-100px)]">
          {stage === 'checkout' && (
            <div className="flex-1 pr-4 md:border-r overflow-y-auto">
                <div className="grid gap-4 py-4">
                  <h3 className="font-bold"><FormattedMessage id="shoppingCart.sheet.checkout.contact" defaultMessage="聯絡方法" /></h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className={cn(errors.name && 'text-destructive')}>
                      <FormattedMessage id="shoppingCart.sheet.checkout.name" defaultMessage="姓名" />
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input {...register('name', { required: true })} />
                  </div>
                  <div>
                    <Label className={cn(errors.phoneNumber && 'text-destructive')}>
                      <FormattedMessage id="shoppingCart.sheet.checkout.phone" defaultMessage="電話" />
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input {...register('phoneNumber', { required: true })} />
                  </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label className={cn(errors.socialHandle && 'text-destructive')}>
                        <FormattedMessage id="shoppingCart.sheet.checkout.socialHandle" defaultMessage="IG/FB 名稱" />
                      </Label>
                      <Input {...register('socialHandle')} />
                    </div>
                    <div>
                      <Label className={cn(errors.socialChannel && 'text-destructive')}>
                        <FormattedMessage id="shoppingCart.sheet.checkout.socialChannel" defaultMessage="從哪下單？" />
                        <span className="text-destructive">*</span>
                      </Label>
                      <Controller control={control} name="socialChannel" rules={{ required: true }} render={({field}) => (
                        <SocialChannelSelect {...field} className="mt-1 w-full" />
                      )} />
                    </div>
                  </div>
                  <Separator />
                  <h3 className="font-bold"><FormattedMessage id="shoppingCart.sheet.checkout.delivery" defaultMessage="送貨方式" /></h3>
                  <div>
                    <Label className={cn(errors.shippingOption && 'text-destructive')}>
                      <FormattedMessage id="shoppingCart.sheet.checkout.address" defaultMessage="送貨方式" />
                      <span className="text-destructive">*</span>
                    </Label>
                    <Controller control={control} name="shippingOption" rules={{ required: true }} render={({field}) => (
                      <ShippingOptionsSelect options={shippingOptions ?? []} {...field} className="mt-1 w-full" />
                    )} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label className={cn(errors.deliveryDate && 'text-destructive')}>
                        <FormattedMessage id="shoppingCart.sheet.checkout.deliveryDate" defaultMessage="取貨日期" />
                        <span className="text-destructive">*</span>
                      </Label>
                      <Controller control={control} name="deliveryDate" rules={{ required: true }} render={({field}) => (
                        <DatePicker {...field} className="mt-1 w-full" />
                      )} />
                    </div>
                    <div>
                      <Label className={cn(errors.shippingOption && 'text-destructive')}>
                        <FormattedMessage id="shoppingCart.sheet.checkout.deliveryHour" defaultMessage="取貨時間" />
                        <span className="text-destructive">*</span>
                      </Label>
                      <Controller control={control} name="deliveryHour" rules={{ required: true }} render={({field}) => (
                        <TimeslotsSelect {...field} className="mt-1 w-full" />
                      )} />
                    </div>
                  </div>
                  <div>
                    <Label className={cn((errors.address1 ?? errors.address2) && 'text-destructive')}>
                      <FormattedMessage id="shoppingCart.sheet.checkout.address" defaultMessage="地址" />
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input className="mt-1" {...register('address1', { required: true })} />
                    <Input className="mt-2" {...register('address2')} />
                  </div>
                  <div>
                    <Label className={cn(errors.remark && 'text-destructive')}>
                      <FormattedMessage id="shoppingCart.sheet.checkout.remark" defaultMessage="備註" />
                    </Label>
                    <Textarea className="mt-1" {...register('remark')} />
                  </div>
                  <h3 className="font-bold"><FormattedMessage id="shoppingCart.sheet.checkout.payment" defaultMessage="付款方式" /></h3>
                  <div>
                    <Label className={cn(errors.paymentOption && 'text-destructive')}>
                      <FormattedMessage id="shoppingCart.sheet.checkout.paymentMethod" defaultMessage="付款方式" />
                      <span className="text-destructive">*</span>
                    </Label>
                    <Controller control={control} name="paymentOption" rules={{ required: true }} render={({field}) => (
                      <PaymentOptionsSelect options={paymentOptions ?? []} {...field} className="mt-1 w-full" />
                    )} />
                    {selectedPaymentOption?.instructions &&
                      <p className="mt-1 text-sm"><Translated t={selectedPaymentOption?.instructions} /></p>
                    }
                  </div>
                </div>
            </div>
          )}
          <div className={cn(stage === "checkout" && "hidden md:block", "pl-4 h-full")}>
            <div className="grid gap-4 py-4">
              {cart?.items.map((item) => {
                const image = item.product.gallery[0];

                return (
                  <div key={item.id} className="grid grid-cols-4 space-x-4 px-1 py-4 border-b">
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      {image ? (
                        <Image src={image.url} alt="" width={80} height={80} className="max-h-20" />
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
                    <div className="flex col-span-3">
                    <div className="flex-1">
                      <Label className="font-bold text-lg"><Translated t={item.product.name as unknown as any} /></Label>
                      {Object.values(item.productFieldValues
                        .filter((productFieldValue) => productFieldValue.fieldOptionAsset ?? productFieldValue.fieldOption ?? productFieldValue.fieldValue)
                        .reduce((acc, productFieldValue) => {
                          if (!acc[productFieldValue.fieldId]) {
                            acc[productFieldValue.field.id] = {
                              field: productFieldValue.field,
                              values: []
                            };
                          }

                          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                          acc[productFieldValue.field.id]!.values.push(productFieldValue);
                          return acc;
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        }, {} as Record<string, any>))
                        .map((groupedProductFieldValues: any) => (
                          <div
                            key={groupedProductFieldValues.field.id}
                            className={cn(groupedProductFieldValues.values.length == 1 && "flex")}
                          >
                            <div className="flex-shrink-0 mr-2"><Translated t={groupedProductFieldValues.field.name} />:</div>
                            {groupedProductFieldValues.values.map((productFieldValue: any) => (
                              <div key={productFieldValue.id} className="text-sm">
                                {groupedProductFieldValues.values.length != 1 && '- '}
                                {productFieldValue.fieldOption
                                  ? <Translated t={productFieldValue.fieldOption?.name} />
                                  : productFieldValue.fieldOptionAsset
                                  ? <a href={productFieldValue.fieldOptionAsset?.url} target='_blank'>
                                      <Image alt="" src={productFieldValue.fieldOptionAsset?.url} width={60} height={60} />
                                    </a>
                                  : productFieldValue.fieldValue}
                              </div>
                            ))}
                          </div>
                        ))}
                    </div>
                      <span className="text-sm text-right">{cart.currency.symbol}{item.total}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        {(cart?.items.length ?? 0) > 0 && (
          <div className="absolute bottom-6 inset-x-6">
            {stage === 'checkout' ? (
              <Button size="lg" className="w-full" type="submit" isLoading={isSubmitting}>
                <FormattedMessage id="shoppingCart.sheet.checkout" defaultMessage="進行結賬" />
              </Button>
            ) : (
            <Button size="lg" className="w-full" type="button" onClick={(event) => {
              event.preventDefault(); setStage('checkout')
            }}>
              <FormattedMessage id="shoppingCart.sheet.confirm" defaultMessage="確認" />
            </Button>
            )}
          </div>
        )}
        </form>
      </SheetContent>
    </Sheet>
  );
}

export default ViewShoppingCartButton