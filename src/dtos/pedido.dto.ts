export interface DetallePedidoDTO {
  producto_id: number;
  cantidad: number;
}

export interface CreatePedidoDTO {
  // El usuario_id lo obtendremos del Token, no del body
  items: DetallePedidoDTO[]; 
}
