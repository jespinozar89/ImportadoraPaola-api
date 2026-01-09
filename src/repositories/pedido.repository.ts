import { PrismaClient, Pedido, EstadoPedido } from '@prisma/client';
import { IPedidoRepository } from '../interfaces/pedido.repository.interface';
import { CreatePedidoDTO } from '@/dtos/pedido.dto';

const prisma = new PrismaClient();

export class PrismaPedidoRepository implements IPedidoRepository {

  async createTransaction(data: CreatePedidoDTO): Promise<Pedido> {
    
    return await prisma.pedido.create({
      data: {
        usuario_id: data.usuario_id,
        fecha_pedido: new Date(),
        estado: 'Pendiente',
        total: data.total,
        comprobante_pago: data.comprobante_pago ?? null,
        detalles: {
          create: data.detalles.map(d => ({
            producto_id: d.producto_id,
            cantidad: d.cantidad,
            precio_unitario: d.precio_unitario
          }))
        }
      }
    });
  }

  async findAll(): Promise<Pedido[]> {
    return await prisma.pedido.findMany({
      include: {
        usuario: { select: { nombres: true, email: true } },
        detalles: true
      },
      orderBy: { fecha_pedido: 'desc' }
    });
  }

  async findByUserId(userId: number): Promise<Pedido[]> {
    return await prisma.pedido.findMany({
      where: { usuario_id: userId },
      include: { detalles: true },
      orderBy: { fecha_pedido: 'desc' }
    });
  }

  async findById(id: number): Promise<Pedido | null> {
    return await prisma.pedido.findUnique({
      where: { pedido_id: id },
      include: { detalles: { include: { producto: true } } }
    });
  }

  async updateStatus(id: number, estado: EstadoPedido): Promise<Pedido> {
    return await prisma.pedido.update({
      where: { pedido_id: id },
      data: { estado }
    });
  }
}