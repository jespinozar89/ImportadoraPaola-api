import { CreateShipmentDTO, UpdateShipmentStatusDTO } from "@/dtos/envio.dto";
import { IEnvioRepository } from "@/interfaces/envio.repository.interface";


export class EnvioService {
  constructor(private envioRepository: IEnvioRepository) {}

  async getShipmentByOrderId(orderId: number) {
    const shipment = await this.envioRepository.findByOrderId(orderId);
    if (!shipment) {
      throw new Error(`No se encontró un registro de envío para el pedido #${orderId}`);
    }
    return shipment;
  }

  async getShipmentByFreightNumber(freightNumber: string) {
    const shipment = await this.envioRepository.findByFreightNumber(freightNumber);
    if (!shipment) {
      throw new Error(`No se encontró un registro de envío para la orden de carga #${freightNumber}`);
    }
    return shipment;
  }

  async createShipment(data: CreateShipmentDTO) {
    if (!data.pedido_id || !data.numero_flete) {
      throw new Error('El ID del pedido y el número de flete son obligatorios.');
    }

    const existingShipment = await this.envioRepository.findByFreightNumber(data.numero_flete);
    if (existingShipment) {
      throw new Error(`El envío con número de flete #${data.numero_flete} ya existe.`);
    }

    return await this.envioRepository.createShipment(data);
  }

  async updateShipmentStatus(freightNumber: string, updateData: UpdateShipmentStatusDTO) {
    const shipment = await this.envioRepository.findByFreightNumber(freightNumber);
    if (!shipment) {
      throw new Error(`No se encontró un registro de envío para la orden de carga #${freightNumber}`);
    }

    return await this.envioRepository.updateShipmentStatus(shipment.envio_id, updateData);
  }
}