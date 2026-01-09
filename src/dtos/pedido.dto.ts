export interface CreatePedidoDTO {
    usuario_id: number;
    total: number;
    comprobante_pago?: string | undefined; 
    detalles: DetallePedidoDTO[]; 
}

export interface DetallePedidoDTO {
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
}
