import Translated from '@/components/Translated';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { type ProductField } from '@/models/product';
import React, { useState } from 'react';
import { defineMessage, useIntl } from 'react-intl';

export interface ProductFieldCheckboxesValue {
  selected: string[];
  otherSelected: boolean;
  other: string;
}

export interface ProductFieldCheckboxesProps {
  field: ProductField;
  value?: ProductFieldCheckboxesValue;
  onChange: (value: ProductFieldCheckboxesValue) => void;
}

const ProductFieldCheckboxes: React.FC<ProductFieldCheckboxesProps> = ({ field, value = { selected: [], otherSelected: false, other: '' }, onChange }) => {
  const intl = useIntl();

  return (
    <div className="space-y-4">
      {field.fieldValues.map((fieldValue) => (
        <div key={fieldValue.id} className="flex items-center space-x-2 cursor-pointer">
          <Checkbox
            id={fieldValue.id}
            checked={value?.selected.includes(fieldValue.id)}
            onCheckedChange={(checked) => {
              console.log("=== checked", checked);
              if (checked) {
                onChange({
                  ...value,
                  selected: [...value.selected, fieldValue.id]
                });
              } else {
                onChange({
                  ...value,
                  selected: value.selected.filter((v) => v !== fieldValue.id),
                });
              }
            }}
          >
          </Checkbox>
          <label
            htmlFor={fieldValue.id}
            className="cursor-pointer text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <Translated t={fieldValue.name} />
          </label>
        </div>
      ))}
      <div key={field.id + "-other"} className="flex items-center space-x-2 cursor-pointer">
          <Checkbox
            id={field.id + "-other"}
            checked={value?.otherSelected}
            onCheckedChange={(checked) => {
              onChange({
                ...value,
                otherSelected: !!checked,
              });
            }}
          >
          </Checkbox>
          <Input
            // FIXME: Add variant
            className="h-7"
            placeholder={intl.formatMessage(
              defineMessage({
                id: 'productDetail.checkboxes.other.placeholder',
                defaultMessage: '其他',
              })
            )}
            value={value.other}
            onChange={ev => onChange({ ...value, otherSelected: true, other: ev.target.value })}
          />
        </div>
    </div>
  );
}

export default ProductFieldCheckboxes