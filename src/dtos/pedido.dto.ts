export interface DetallePedidoDTO {
  producto_id: number;
  cantidad: number;
}

export interface CreatePedidoDTO {
  items: DetallePedidoDTO[]; 
}
