import { PrismaClient, Pedido, EstadoPedido } from '@prisma/client';
import { IPedidoRepository, PedidoData } from '../interfaces/pedido.repository.interface';

const prisma = new PrismaClient();

export class PrismaPedidoRepository implements IPedidoRepository {
  
  // ⚠️ MÉTODO TRANSACCIONAL: Crea pedido, detalles
  async createTransaction(data: PedidoData): Promise<Pedido> {
    return await prisma.$transaction(async (tx) => {
      // 1. Crear el Pedido Encabezado
      const nuevoPedido = await tx.pedido.create({
        data: {
          usuario_id: data.usuario_id,
          total: data.total,
          estado: 'Pendiente',
          // 2. Crear los Detalles (ProductosPedido) anidados
          detalles: {
            create: data.detalles.map(item => ({
              producto_id: item.producto_id,
              cantidad: item.cantidad,
              precio_unitario: item.precio_unitario
            }))
          }
        },
        include: { detalles: true } // Para devolver el pedido completo
      });

      return nuevoPedido;
    });
  }

  async findAll(): Promise<Pedido[]> {
    return await prisma.pedido.findMany({
      include: { 
        usuario: { select: { nombres: true, email: true } }, // Incluir datos del usuario
        detalles: true // Incluir los productos del pedido
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