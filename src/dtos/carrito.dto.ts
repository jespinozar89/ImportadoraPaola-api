export interface AddItemToCartDTO {
  producto_id: number;
  cantidad: number;
}

export interface UpdateItemQuantityDTO {
  cantidad: number;
}