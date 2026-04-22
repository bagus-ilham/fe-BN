export interface ReserveInventoryRequest {
  variant_id: string;
  quantity: number;
  payment_order_id: string;
  customer_email?: string;
}

interface ReserveInventorySuccessResponse {
  success: true;
  reservation_id: string;
}

interface ReserveInventoryErrorResponse {
  success: false;
  error: string;
}

export type ReserveInventoryResponse =
  | ReserveInventorySuccessResponse
  | ReserveInventoryErrorResponse;

export interface InventoryStatusItem {
  variant_id: string;
  product_id: string;
  product_name: string | null;
  is_active: boolean;
  stock_quantity: number;
  reserved_quantity: number;
  available_quantity: number;
  updated_at: string | null;
}

