import { Courier, EstadoEnvio } from '@prisma/client';

export interface CreateShipmentDTO {
  pedido_id: number;
  courier?: Courier;
  numero_flete: string;
  estado?: EstadoEnvio;
  fecha_despacho?: Date | string;
  nombre_recibe?: string;
  rut_recibe?: string;
  observacion?: string;
}

export interface UpdateShipmentStatusDTO {
  estado?: EstadoEnvio;
  estado_macro?: string | null;
  estado_micro?: number | null;
  descripcion_estado?: string | null;
  numero_flete?: string;
  numero_flete_nuevo?: string;
  nombre_recibe?: string | null;
  rut_recibe?: string | null;
  latitud?: string | null;
  longitud?: string | null;
  url_comprobante?: string | null;
  tipo_devolucion?: string | null;
  observacion?: string | null;
  fecha_entrega?: Date | string | null;
  raw_payload?: any;
}

export interface ShipmentHistoryResponseDTO {
  historial_id: number;
  envio_id: number;
  estado_macro: string;
  estado_micro: string | null;
  descripcion_estado: string | null;
  fecha_evento: Date;
  creado_en: Date;
}

export interface ShipmentDetailResponseDTO {
  envio_id: number;
  pedido_id: number;
  empresa: string;
  numero_flete: string;
  numero_flete_nuevo: string | null;
  estado: string;
  fecha_despacho: Date | null;
  fecha_entrega: Date | null;
  nombre_recibe: string | null;
  rut_recibe: string | null;
  url_comprobante: string | null;
  tipo_devolucion: string | null;
  historial: ShipmentHistoryResponseDTO[];
}