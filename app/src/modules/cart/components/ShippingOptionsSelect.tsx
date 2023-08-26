import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import React from 'react';
import Translated from '@/components/Translated';
import { type ShippingOption } from '@/models/shipping';

export interface ShippingOptionsSelectProps {
  className?: string;
  options: ShippingOption[];
  value?: string;
  onChange: (value: string) => void;
}

const ShippingOptionsSelect: React.FC<ShippingOptionsSelectProps> = ({ className, options, value, onChange }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((item) => (
          <SelectItem key={item.id} value={item.id} onClick={() => onChange(item.id)}>
            <Translated t={item.name} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default ShippingOptionsSelect