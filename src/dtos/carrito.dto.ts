export interface AddItemToCartDTO {
  producto_id: number;
  cantidad: number;
}

export interface UpdateItemQuantityDTO {
  cantidad: number;
}

export interface CarritoDetalladoDTO {
  carrito_id: number;
  cantidad: number;
  producto_id: number;
  nombre: string;
  precio: number;
  imagen: string;
}