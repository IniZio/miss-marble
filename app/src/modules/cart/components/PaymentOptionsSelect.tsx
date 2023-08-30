import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import React from 'react';
import Translated from '@/components/Translated';
import { type PaymentOption } from '@/models/payment';

export interface PaymentOptionsSelectProps {
  className?: string;
  options: PaymentOption[];
  value?: string;
  onChange: (value: string) => void;
}

const PaymentOptionsSelect: React.FC<PaymentOptionsSelectProps> = ({ className, options, value, onChange }) => {
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

export default PaymentOptionsSelect