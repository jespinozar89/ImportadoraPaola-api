import { CreatePedidoDTO, EstadoPedido } from '../dtos/pedido.dto';
import { IPedidoRepository } from '../interfaces/pedido.repository.interface';
import { Pedido, Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PedidoService {
  constructor(private pedidoRepository: IPedidoRepository) { }

  async create(data: CreatePedidoDTO) {
    if (!data.detalles || data.detalles.length === 0) {
      throw new Error("El pedido debe contener al menos un producto.");
    }

    let totalPedido = 0;
    const detallesProcesados = [];

    for (const item of data.detalles) {

      const producto = await prisma.producto.findUnique({
        where: { producto_id: item.producto_id }
      });

      if (!producto) {
        throw new Error(`El producto con ID ${item.producto_id} no existe.`);
      }

      const precioEfectivo = producto.precio_oferta && Number(producto.precio_oferta) > 0 
        ? Number(producto.precio_oferta) 
        : Number(producto.precio);

      totalPedido += precioEfectivo * item.cantidad;

      detallesProcesados.push({
        producto_id: producto.producto_id,
        cantidad: item.cantidad,
        precio_unitario: Number(producto.precio),
        precio_unitario_oferta: item.precio_unitario_oferta ? Number(item.precio_unitario_oferta) : null,
      });
    }

    return await this.pedidoRepository.createTransaction({
      usuario_id: data.usuario_id,
      estado: data.estado,
      total: totalPedido,
      klap_order_id: data.klap_order_id,
      detalles: detallesProcesados
    });
  }

  async findAll(page: number, limit: number, filtros: any) {
    return await this.pedidoRepository.findAll(page, limit, filtros);
  }

  async findByUserId(userId: number, page: number, limit: number, search?: string) {
    return await this.pedidoRepository.findByUserId(userId, page, limit, search);
  }

  async findOrderByUserIdAndPedidoId(userId: number, pedidoId: number) {
    return await this.pedidoRepository.findOrderByUserIdAndPedidoId(userId, pedidoId);
  }

  async findById(id: number) {
    const pedido = await this.pedidoRepository.findById(id);
    if (!pedido) throw new Error("Pedido no encontrado");
    return pedido;
  }

  async findByKlapId(id: string) {
    const pedido = await this.pedidoRepository.findByKlapId(id);
    if (!pedido) throw new Error("Pedido no encontrado");
    return pedido;
  }

  async updateStatus(id: number, estado: EstadoPedido) {
    return await this.pedidoRepository.updateStatus(id,estado);
  }

  async updateKlapOrderId(oldKlapOrderId: string, newKlapOrderId: string): Promise<any> {
    return await this.pedidoRepository.updateKlapOrderId(oldKlapOrderId, newKlapOrderId);
  }
}