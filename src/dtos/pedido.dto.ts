export interface CreatePedidoDTO {
  usuario_id?: number | null;
  nombre_contacto: string;
  email_contacto: string;
  telefono_contacto: string;
  direccion_envio: string;
  estado: EstadoPedido;
  total: number;
  klap_order_id?: string | null;
  detalles: DetallePedidoDTO[];
}

export interface DetallePedidoDTO {
  producto_id: number;
  nombre?: string;
  cantidad: number;
  precio_unitario: number;
  precio_unitario_oferta?: number | null;
}

export interface UpdatePedidoDTO {
  usuario_id: number;
  estado: EstadoPedido;
}

export enum EstadoPedido {
  Pendiente = 'Pendiente',
  PendienteDeConfirmacion = 'PendienteDeConfirmacion',
  EnPreparacion = 'EnPreparacion',
  Listo = 'Listo',
  Entregado = 'Entregado',
  Cancelado = 'Cancelado'
}
