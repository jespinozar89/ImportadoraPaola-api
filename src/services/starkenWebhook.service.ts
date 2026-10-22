import { StarkenWebhookPayload } from '../dtos/starken.dto';
import { EnvioService } from './envio.service';
import { mapStarkenStatusToEstadoEnvio } from '../utils/starken.mapper';

export class StarkenWebhookService {
  constructor(private envioService: EnvioService) {}

  async processWebhookEvent(payload: StarkenWebhookPayload): Promise<void> {
    const freightNumber = String(payload.numeroOrdenFlete);

    if (!freightNumber) {
      throw new Error('Missing numeroOrdenFlete in webhook payload');
    }

    const mappedStatus = mapStarkenStatusToEstadoEnvio(payload.nombreEstadoHomologado);

    let rutRecibeFormatted: string | undefined = undefined;
    if (payload.rutRecibe !== undefined && payload.rutRecibe !== null) {
      rutRecibeFormatted = payload.dvRecibe
        ? `${payload.rutRecibe}-${payload.dvRecibe}`
        : String(payload.rutRecibe);
    }

    let fechaEvento: Date | undefined = undefined;
    if (payload.fechatoraEvento) {
      const parts = payload.fechatoraEvento.split(' ');
      const datePart = parts[0];
      const timePart = parts[1];

      if (datePart && timePart) {
        const [day, month, year] = datePart.split('-');
        if (day && month && year) {
          fechaEvento = new Date(`${year}-${month}-${day}T${timePart}`);
        }
      }
    }

    const estadoMicroVal = payload.estadoMicro ?? payload.codigoInternoEstado ?? null;
    const descripcionVal = payload.descripcionEstado || payload.observacion || null;
    const fleteNuevoVal = payload.numeroOrdenFleteNuevo ? String(payload.numeroOrdenFleteNuevo) : '';
    const nombreRecibeVal = payload.nombreRecibe || null;
    const latitudVal = payload.latitud || null;
    const longitudVal = payload.longitud || null;
    const urlComprobanteVal = payload.urlImagen || null;
    const tipoDevolucionVal = payload.tipoDevolucion || null;
    const observacionVal = payload.observacion || null;

    await this.envioService.updateShipmentStatus(freightNumber, {
      estado: mappedStatus,
      estado_macro: payload.nombreEstadoHomologado || String(mappedStatus),
      estado_micro: estadoMicroVal,
      descripcion_estado: descripcionVal,
      numero_flete_nuevo: fleteNuevoVal,
      nombre_recibe: nombreRecibeVal,
      rut_recibe: rutRecibeFormatted || null,
      latitud: latitudVal,
      longitud: longitudVal,
      url_comprobante: urlComprobanteVal,
      tipo_devolucion: tipoDevolucionVal,
      observacion: observacionVal,
      fecha_entrega: mappedStatus === 'ENTREGADO' ? (fechaEvento || new Date()) : null,
      raw_payload: payload,
    });
  }
}