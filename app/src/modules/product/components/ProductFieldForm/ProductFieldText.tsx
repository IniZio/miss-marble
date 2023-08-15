import React, { type ChangeEvent } from 'react';
import { type ProductDetailField } from '../../models/productDetail';
import { Input } from '@/components/ui/input';

export interface ProductFieldTextProps {
  field: ProductDetailField;
  value: string;
  onChange: (ev: ChangeEvent<HTMLInputElement>) => void;
}

const ProductFieldText: React.FC<ProductFieldTextProps> = ({ field, value, onChange }) => {
  return (
    <Input name={field.id} value={value} onChange={onChange} />
  );
}

export default ProductFieldText