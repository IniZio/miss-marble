import React from 'react';
import { type ProductField, ProductFieldType } from '@/models/product';
import ProductFieldSelect from './ProductFieldSelect';
import ProductFieldText from './ProductFieldText';
import ProductFieldCheckboxes, { type ProductFieldCheckboxesValue } from './ProductFieldCheckboxes';
import ProductFieldFile from './ProductFieldFile';
import { type AssetUpload } from '@/models/asset';

export interface ProductFieldInputProps {
  field: ProductField;
  value: unknown;
  onChange: (value: unknown) => void;
}

const ProductFieldInput: React.FC<ProductFieldInputProps> = ({ field, value, onChange }) => {
  switch (field.type) {
    case ProductFieldType.Select:
      return (
        <ProductFieldSelect field={field} value={value as string} onChange={onChange} />
      );
    case ProductFieldType.Text:
      return (
        <ProductFieldText field={field} value={value as string} onChange={onChange} />
      );
    case ProductFieldType.Checkboxes:
      return (
        <ProductFieldCheckboxes field={field} value={value as ProductFieldCheckboxesValue | undefined} onChange={onChange} />
      )
    case ProductFieldType.Asset:
      return (
        <ProductFieldFile field={field} value={value as AssetUpload | undefined} onChange={onChange} />
      )
    default:
      return null;
  }
}

export default ProductFieldInput