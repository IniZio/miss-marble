import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import React from 'react';
import Translated from '@/components/Translated';
import { type PaymentOption } from '@/models/payment';

const TimeslotOptions = [
  {
    name: '10:00 - 11:00',
    value: 10,
  },
  {
    name: '11:00 - 12:00',
    value: 11,
  },
  {
    name: '12:00 - 13:00',
    value: 12,
  },
  {
    name: '13:00 - 14:00',
    value: 13,
  },
  {
    name: '14:00 - 15:00',
    value: 14,
  },
  {
    name: '15:00 - 16:00',
    value: 15,
  },
  {
    name: '16:00 - 17:00',
    value: 16,
  },
  {
    name: '17:00 - 18:00',
    value: 17,
  },
  {
    name: '18:00 - 19:00',
    value: 18,
  },
  {
    name: '19:00 - 20:00',
    value: 19,
  },
];

export interface TimeslotsSelectProps {
  className?: string;
  options?: typeof TimeslotOptions;
  value?: number;
  onChange: (value: number) => void;
}

const TimeslotsSelect: React.FC<TimeslotsSelectProps> = ({ className, options = TimeslotOptions, value, onChange }) => {
  return (
    <Select value={value?.toString()} onValueChange={val => onChange(parseInt(val, 10))}>
      <SelectTrigger className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((item) => (
          <SelectItem key={item.value} value={item.value.toString()} onClick={() => onChange(item.value)}>
            {item.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default TimeslotsSelect