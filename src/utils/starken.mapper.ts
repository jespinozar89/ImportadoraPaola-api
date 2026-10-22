import { EstadoEnvio } from '@prisma/client';

export function mapStarkenStatusToEstadoEnvio(status: string | undefined): EstadoEnvio {
  if (!status) return EstadoEnvio.CREADO;

  const upperStatus = status.toUpperCase().trim();

  switch (upperStatus) {
    case 'EN TRANSITO A DESTINO':
    case 'EN TRANSITO':
      return EstadoEnvio.EN_TRANSITO_A_DESTINO;

    case 'RECIBIDO EN AGENCIA DESTINO':
    case 'RECIBIDO EN AGENCIA':
      return EstadoEnvio.RECIBIDO_EN_AGENCIA;

    case 'EN REPARTO A DOMICILIO':
    case 'EN REPARTO':
      return EstadoEnvio.EN_REPARTO;

    case 'ENTREGADO':
      return EstadoEnvio.ENTREGADO;

    case 'NO ENTREGADO':
    case 'CERRADO CON EXCEPCION':
    case 'PENDIENTE':
    case 'REDESTINADO':
      return EstadoEnvio.NO_ENTREGADO;

    case 'ANULADO':
      return EstadoEnvio.ANULADO;

    default:
      return EstadoEnvio.EN_TRANSITO_A_DESTINO;
  }
}