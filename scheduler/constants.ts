export const PUBLIC_STORAGE_BUCKET_NAME = 'missmarble';

export const GOOGLE_FORM_ORDER_FIELDS = {
  paid: 1,
  created_at: 0,
  name: 2,
  phone: 3,
  date: 4,
  time: 5,
  cake: 6,
  taste: 7,
  size: 9,
  color: 8,
  sentence: 11,
  paid_sentence: 12,
  toppings: 10,
  social_name: 13,
  order_from: 14,
  delivery_method: 15,
  delivery_address: 16,
  delivery_time: 17,
  remarks: [18, 19],
  printed_at: 89,
  printed: 90,
  index: 91,
} as const;

export const GOOGLE_FORM_INVENTORY_FIELDS = {
  id: 1,
  name: 2,
  category: 3,
  thumbnail: 4,
  quantity: 8,
  unit: 9,
  level_name: 11,
  safe_quantity: 13,
} as const;
