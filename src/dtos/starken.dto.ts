export interface StarkenWebhookResponseDTO {
  mensaje: string;
}

export interface StarkenWebhookPayload {
  reIntentoWebhook?: number;
  rutEmpresa?: number;
  numeroOrdenFlete: number | string;
  estadoMicro?: number;
  folio?: number;
  estadoMacro?: number;
  nombreEstadoHomologado: string;
  descripcionEstado?: string;
  codigoEstadoHomologado?: string;
  codigoInternoEstado?: number;
  fechatoraEvento?: string;
  latitud?: string;
  longitud?: string;
  nombreRecibe?: string;
  rutRecibe?: number | string;
  dvRecibe?: string;
  tipoDevolucion?: string | null;
  isDevolucion?: boolean;
  OFOriginal?: number;
  OFAnterior?: number;
  numeroOrdenFleteNuevo?: number | string | null;
  ubicacionActual?: string;
  codigoAgenciaDestino?: number;
  ciudadDestino?: string;
  observacion?: string;
  urlImagen?: string;
}

export interface StarkenTrackingResponse {
  cantidadBultos: number;
  cantidadKilos: number;
  ciudadDestino: string;
  ciudadOrigen: string;
  codigoAgenciaDestino: number;
  codigoEstadoHomologado: number;
  cuentaCorriente: number;
  descEstadoHomologado: string;
  descripcionAgenciaDestino: string;
  direccionAgenciaDestino: string;
  documentoCliente: number;
  estadoFlete: string;
  estadoHomologado: string;
  fechaCompromiso?: string;
  fechaEmision?: string;
  fechaEntrega?: string;
  nombreDestinatario: string;
  nombreRemitente: string;
  nombreRetira?: string;
  ordenFlete: number;
  rutRetira?: string;
  tipoEntrega: string;
  tipoServicio: string;
  valorFlete: number;
}