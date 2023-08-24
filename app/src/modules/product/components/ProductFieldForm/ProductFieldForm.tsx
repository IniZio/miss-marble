import { Controller, type FieldValues, type SubmitHandler, useForm } from 'react-hook-form';
import Translated from '@/components/Translated';
import { ProductFieldType, type ProductField } from '@/models/product';
import React from 'react';
import ProductFieldInput from './ProductFieldInput';
import { FormattedMessage } from 'react-intl';
import { Button } from '@/components/ui/button';

const ProductFieldForm: React.FC<{fields: ProductField[]}> = ({ fields }) => {
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
  const onSubmit: SubmitHandler<FieldValues> = (data: unknown) => console.log(data)

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {fields.map(productField => (
        <div key={productField.id} className="space-y-2">
          <label htmlFor={productField.id} className="text-sm font-medium"><Translated t={productField.name} /></label>
          <Controller
            name={productField.id}
            control={control}
            render={({ field }) => <ProductFieldInput field={productField} {...field}  />}
          />
        </div>
      ))}
      <pre>{JSON.stringify(errors, null, 4)}</pre>
      <Button className="!mt-4" type="submit">
        <FormattedMessage id="productDetail.addToCart" defaultMessage="添加到購物車" />
      </Button>
    </form>
  );
}

export default ProductFieldForm