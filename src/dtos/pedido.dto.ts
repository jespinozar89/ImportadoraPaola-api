export interface CreatePedidoDTO {
    usuario_id: number;
    total: number;
    klap_order_id?: string | undefined; 
    detalles: DetallePedidoDTO[]; 
}

export interface DetallePedidoDTO {
  producto_id: number;
  nombre?: string;
  cantidad: number;
  precio_unitario: number;
}

export interface UpdatePedidoDTO {
    usuario_id: number;
    estado: EstadoPedido;
}

export enum EstadoPedido {
  Pendiente = 'Pendiente',
  EnPreparacion = 'EnPreparacion',
  Listo = 'Listo',
  Entregado = 'Entregado',
  Cancelado = 'Cancelado'
}
