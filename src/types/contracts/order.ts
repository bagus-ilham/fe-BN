export interface OrderItemInput {
  variant_id: string;
  quantity: number;
  price: number;
  product_id: string;
  product_name: string;
  image?: string;
}

export interface CreateOrderRequest {
  orderId: string;
  userId: string | null;
  email: string;
  name: string;
  phone: string;
  nik: string | null;
  total: number;
  shipping: number;
  zip: string;
  street: string;
  city: string;
  state: string;
  couponCode: string | null;
  items: OrderItemInput[];
}

