import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import React from 'react';
import Translated from '@/components/Translated';
import { type ShippingOption } from '@/models/shipping';

const SocialChannelOptions = [
  {
    name: 'IG/FB',
  },
  {
    name: 'Whatsapp',
  },
  {
    name: '門市下單',
  }
]

export interface SocialChannelSelectProps {
  className?: string;
  value?: string;
  onChange: (value: string) => void;
}

const SocialChannelSelect: React.FC<SocialChannelSelectProps> = ({ className, value, onChange }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {SocialChannelOptions.map((item) => (
          <SelectItem key={item.name} value={item.name} onClick={() => onChange(item.name)}>
            {item.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default SocialChannelSelect