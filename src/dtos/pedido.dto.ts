export interface CreatePedidoDTO {
  usuario_id?: number | null;
  nombre_contacto: string;
  email_contacto: string;
  telefono_contacto: string;
  direccion_envio: string;
  tipo_entrega: TipoEntrega; 
  subtotal: number;       
  costo_envio: number;      
  total: number;
  estado: EstadoPedido;
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

export enum TipoEntrega {
  retiro = 'retiro',
  despacho = 'despacho'
}

export enum EstadoPedido {
  Pendiente = 'Pendiente',
  PendienteDeConfirmacion = 'PendienteDeConfirmacion',
  EnPreparacion = 'EnPreparacion',
  Despachado = 'Despachado',
  Listo = 'Listo',
  Entregado = 'Entregado',
  Cancelado = 'Cancelado'
}
