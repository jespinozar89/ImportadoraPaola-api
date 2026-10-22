import { CreateShipmentDTO, UpdateShipmentStatusDTO } from "@/dtos/envio.dto";
import { Envio, HistorialEnvio } from "@prisma/client";

export interface IEnvioRepository {
  findByOrderId(orderId: number): Promise<(Envio & { historial: HistorialEnvio[] }) | null>;
  findByFreightNumber(freightNumber: string): Promise<(Envio & { historial: HistorialEnvio[] }) | null>;
  createShipment(data: CreateShipmentDTO): Promise<Envio>;
  updateShipmentStatus(
    envioId: number,
    updateData: UpdateShipmentStatusDTO
  ): Promise<Envio>;
}