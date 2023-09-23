import { Controller, type FieldValues, type SubmitHandler, useForm } from 'react-hook-form';
import Translated from '@/components/Translated';
import { ProductFieldType, type ProductField } from '@/models/product';
import React, { useCallback } from 'react';
import ProductFieldInput from './ProductFieldInput';
import { FormattedMessage } from 'react-intl';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/ui';
import { useLoadingCallback } from '@/hooks/useLoadingCallback';

export type ProductFieldValues = Record<string, unknown>;

interface ProductFieldFormProps {
  fields: ProductField[];
  onAddToCart: (values: ProductFieldValues) => Promise<void>;
}

const ProductFieldForm: React.FC<ProductFieldFormProps> = ({ fields, onAddToCart }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: fields.reduce((acc, field) => {
      switch(field.type) {
        case ProductFieldType.Select:
          acc[field.id] = field.fieldOptions[0]?.id;
          break;
        default:
      }
      return acc;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    , {} as Record<string, any>),
  });
  const [onSubmit, { isLoading: isSubmitting }] = useLoadingCallback(async (data: unknown) => {
    await onAddToCart(data as ProductFieldValues);
  }, [onAddToCart]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {fields.map(productField => (
        <div key={productField.id} className="space-y-2">
          <label htmlFor={productField.id} className={cn("text-sm font-medium transition-colors", errors[productField.id] && 'text-destructive')}>
            <Translated t={productField.name} />
            {productField.required && <span className="text-destructive">*</span>}
          </label>
          <Controller
            name={productField.id}
            control={control}
            rules={{ required: productField.required }}
            render={({ field }) => <ProductFieldInput field={productField} {...field}  />}
          />
          {/* <p role="alert" className="text-xs text-destructive">
            {errors[productField.id]?.type === 'required' && 'Required'}
          </p> */}
        </div>
      ))}
      <Button className="!mt-4" type="submit" isLoading={isSubmitting}>
        <FormattedMessage id="productDetail.addToCart" defaultMessage="添加到購物車" />
      </Button>
    </form>
  );
}

export default ProductFieldForm