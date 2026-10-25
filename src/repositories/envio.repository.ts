import prisma from "../config/prisma";
import { CreateShipmentDTO, UpdateShipmentStatusDTO } from "@/dtos/envio.dto";
import { IEnvioRepository } from "@/interfaces/envio.repository.interface";
import { Courier, Envio, EstadoEnvio, EstadoPedido, HistorialEnvio } from "@prisma/client";

export class PrismaEnvioRepository implements IEnvioRepository {

  async findByOrderId(orderId: number): Promise<(Envio & { historial: HistorialEnvio[] }) | null> {
    return prisma.envio.findFirst({
      where: { pedido_id: orderId },
      include: {
        historial: {
          orderBy: { fecha_evento: 'desc' }
        }
      }
    });
  }

  async findByFreightNumber(freightNumber: string): Promise<(Envio & { historial: HistorialEnvio[] }) | null> {
    return prisma.envio.findUnique({
      where: { numero_flete: freightNumber },
      include: {
        historial: {
          orderBy: { fecha_evento: 'desc' }
        }
      }
    });
  }

  async createShipment(data: CreateShipmentDTO): Promise<Envio> {
    return prisma.$transaction(async (tx) => {
      const pedido = await tx.pedido.findUnique({
        where: { pedido_id: data.pedido_id },
        select: { estado: true }
      });

      if (!pedido) {
        throw new Error(`No se encontró el pedido #${data.pedido_id}.`);
      }

      if (pedido.estado === EstadoPedido.Cancelado) {
        throw new Error(`No se puede crear un envío para el pedido #${data.pedido_id} porque está cancelado.`);
      }

      const debeDespachar = pedido.estado === EstadoPedido.Pendiente
        || pedido.estado === EstadoPedido.EnPreparacion;
      const actualizacionPedido = await tx.pedido.updateMany({
        where: { pedido_id: data.pedido_id, estado: pedido.estado },
        data: debeDespachar
          ? { estado: EstadoPedido.Despachado, fecha_cambio_estado: new Date() }
          : { estado: pedido.estado }
      });

      if (actualizacionPedido.count !== 1) {
        throw new Error(`El estado del pedido #${data.pedido_id} cambió durante la creación del envío. Intente nuevamente.`);
      }

      const nuevoEnvio = await tx.envio.create({
        data: {
          pedido_id: data.pedido_id,
          courier: data.courier || Courier.STARKEN,
          numero_flete: data.numero_flete,
          estado: data.estado || EstadoEnvio.CREADO,
          fecha_despacho: data.fecha_despacho ? new Date(data.fecha_despacho) : new Date(),
          nombre_recibe: data.nombre_recibe || null,
          rut_recibe: data.rut_recibe || null,
          observacion: data.observacion || null,
        }
      });

      await tx.historialEnvio.create({
        data: {
          envio_id: nuevoEnvio.envio_id,
          estado_macro: data.estado ? String(data.estado) : 'CREADO',
          descripcion_estado: 'Envío registrado exitosamente en la plataforma',
          fecha_evento: new Date(),
        }
      });

      return nuevoEnvio;
    });
  }

  async updateShipmentStatus(
    envioId: number,
    updateData: UpdateShipmentStatusDTO
  ): Promise<Envio> {
    return prisma.$transaction(async (tx) => {
      const dataToUpdate: Record<string, any> = {};

      if (updateData.estado !== undefined) {
        dataToUpdate.estado = updateData.estado;
      }
      if (updateData.numero_flete !== undefined) {
        dataToUpdate.numero_flete = updateData.numero_flete;
      }
      if (updateData.numero_flete_nuevo !== undefined) {
        dataToUpdate.numero_flete_nuevo = updateData.numero_flete_nuevo;
      }
      if (updateData.nombre_recibe !== undefined) {
        dataToUpdate.nombre_recibe = updateData.nombre_recibe;
      }
      if (updateData.rut_recibe !== undefined) {
        dataToUpdate.rut_recibe = updateData.rut_recibe;
      }
      if (updateData.latitud !== undefined) {
        dataToUpdate.latitud = updateData.latitud;
      }
      if (updateData.longitud !== undefined) {
        dataToUpdate.longitud = updateData.longitud;
      }
      if (updateData.url_comprobante !== undefined) {
        dataToUpdate.url_comprobante = updateData.url_comprobante;
      }
      if (updateData.tipo_devolucion !== undefined) {
        dataToUpdate.tipo_devolucion = updateData.tipo_devolucion;
      }
      if (updateData.observacion !== undefined) {
        dataToUpdate.observacion = updateData.observacion;
      }
      if (updateData.fecha_entrega !== undefined) {
        dataToUpdate.fecha_entrega = updateData.fecha_entrega
          ? new Date(updateData.fecha_entrega)
          : null;
      }

      const envioActualizado = await tx.envio.update({
        where: { envio_id: envioId },
        data: dataToUpdate,
      });

      if (
        updateData.numero_flete !== undefined &&
        Object.keys(updateData).every((key) => key === 'numero_flete')
      ) {
        return envioActualizado;
      }

      const estadoMacroFinal = updateData.estado_macro ||
        (updateData.estado ? String(updateData.estado) : 'ACTUALIZACION_DATOS');

      await tx.historialEnvio.create({
        data: {
          envio_id: envioId,
          estado_macro: estadoMacroFinal,
          estado_micro: updateData.estado_micro ?? null,
          descripcion_estado: updateData.descripcion_estado ?? 'Actualización en los datos del envío',
          fecha_evento: new Date(),
          raw_payload: updateData.raw_payload ?? undefined,
        }
      });

      return envioActualizado;
    });
  }

}