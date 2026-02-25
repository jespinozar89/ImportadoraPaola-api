import prisma from "../config/prisma";
import { Pedido, EstadoPedido } from '@prisma/client';
import { IPedidoRepository } from '../interfaces/pedido.repository.interface';
import { CreatePedidoDTO } from '@/dtos/pedido.dto';

export class PrismaPedidoRepository implements IPedidoRepository {

  async createTransaction(data: CreatePedidoDTO): Promise<Pedido> {

    return await prisma.pedido.create({
      data: {
        usuario_id: data.usuario_id,
        fecha_pedido: new Date(),
        fecha_cambio_estado: new Date(),
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

  async findAll(): Promise<any[]> {
    return await prisma.pedido.findMany({
      select: {
        pedido_id: true,
        fecha_pedido: true,
        total: true,
        estado: true,
        usuario: {
          select: {
            nombres: true,
            apellidos: true,
            email: true,
            telefono: true
          }
        },
        detalles: {
          select: {
            cantidad: true,
            precio_unitario: true,
            producto: {
              select: {
                nombre: true
              }
            }
          }
        }
      },
      orderBy: { fecha_pedido: 'desc' }
    });
  }

  async findByUserId(userId: number): Promise<any[]> {
    return await prisma.pedido.findMany({
      where: { usuario_id: userId },
      select: {
        pedido_id: true,
        fecha_pedido: true,
        total: true,
        estado: true,
        comprobante_pago: false,
        detalles: {
          select: {
            cantidad: true,
            precio_unitario: true,
            producto: {
              select: {
                nombre: true,
                imagen: true
              }
            }
          }
        }
      },
      orderBy: { fecha_pedido: 'desc' }
    });
  }


  async findOrderByUserIdAndPedidoId(userId: number, pedidoId: number): Promise<Pedido | null> {
    return await prisma.pedido.findFirst({
      where: {
        usuario_id: userId,
        pedido_id: pedidoId
      },
      include: {
        detalles: {
          include: { producto: true }
        }
      }
    });
  }

  async findById(id: number): Promise<Pedido | null> {
    return await prisma.pedido.findUnique({
      where: { pedido_id: id },
      include: {
        usuario: {
          select: {
            nombres: true,
            apellidos: true,
            email: true,
            telefono: true
          }
        },
        detalles: { include: { producto: true } }
      }
    });
  }

  async updateStatus(id: number, estado: EstadoPedido): Promise<Pedido> {
    return await prisma.pedido.update({
      where: { pedido_id: id },
      data: {
        estado: estado,
        fecha_cambio_estado: new Date()
      }
    });
  }
}