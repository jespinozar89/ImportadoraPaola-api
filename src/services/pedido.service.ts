import { CreatePedidoDTO, DetallePedidoDTO } from '../dtos/pedido.dto';
import { IPedidoRepository } from '../interfaces/pedido.repository.interface';
import { PrismaClient } from '@prisma/client';

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

      const precio = Number(producto.precio);
      totalPedido += precio * item.cantidad;

      detallesProcesados.push({
        producto_id: producto.producto_id,
        cantidad: item.cantidad,
        precio_unitario: precio
      });
    }

    totalPedido += 5000;

    return await this.pedidoRepository.createTransaction({
      usuario_id: data.usuario_id,
      total: totalPedido,
      comprobante_pago: data.comprobante_pago,
      detalles: detallesProcesados
    });
  }

  async findAll() {
    return await this.pedidoRepository.findAll();
  }

  async findByUserId(userId: number) {
    return await this.pedidoRepository.findByUserId(userId);
  }

  async findById(id: number) {
    const pedido = await this.pedidoRepository.findById(id);
    if (!pedido) throw new Error("Pedido no encontrado");
    return pedido;
  }
}