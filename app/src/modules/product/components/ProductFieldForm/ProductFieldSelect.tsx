import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import React from 'react';
import { type ProductDetailField } from '../../models/productDetail';
import Translated from '@/components/Translated';

export interface ProductFieldSelectProps {
  field: ProductDetailField;
  value?: string;
  onChange: (value: string) => void;
}

const ProductFieldSelect: React.FC<ProductFieldSelectProps> = ({ field, value, onChange }) => {
  return (
    <Select name={field.id} value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {field.fieldOptions.map((item) => (
          <SelectItem key={item.id} value={item.id} onClick={() => onChange(item.id)}>
            <Translated t={item.name} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default ProductFieldSelect