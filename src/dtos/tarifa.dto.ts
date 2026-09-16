export interface Tarifa {
  codigo: string | null;
  region: string;
  comuna: string | null;
  costo: number;
  monto_envio_gratis: number | null;
  dias_entrega: number;
}

export interface CotizarEnvioDTO {
  codigoRegion?: string;
  region: string;
  comuna: string;
  subtotal: number;
}

export interface ResultadoCotizacion {
  costoEnvio: number;
  esGratis: boolean;
  diasEntrega: number;
  montoMinimoEnvioGratis: number | null;
}