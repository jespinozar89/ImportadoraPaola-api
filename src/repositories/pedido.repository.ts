import prisma from "../config/prisma";
import { Pedido, EstadoPedido } from '@prisma/client';
import { IPedidoRepository } from '../interfaces/pedido.repository.interface';
import { CreatePedidoDTO } from '@/dtos/pedido.dto';
import { PaginatedResult } from "@/dtos/paginated.dto";

export class PrismaPedidoRepository implements IPedidoRepository {

  async createTransaction(data: CreatePedidoDTO): Promise<Pedido> {

    return await prisma.pedido.create({
      data: {
        usuario_id: data.usuario_id,
        fecha_pedido: new Date(),
        fecha_cambio_estado: new Date(),
        estado: 'Pendiente',
        total: data.total,
        klap_order_id: data.klap_order_id ?? null,
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

  async findAll(
    page: number,
    limit: number,
    filtros: any
  ): Promise<PaginatedResult<any>> {
    const skip = (page - 1) * limit;

    let filtroBusqueda: any = {};

    if (filtros.search && filtros.search.trim() !== '') {
      const searchTerms = filtros.search.trim();
      const palabras = searchTerms.split(/\s+/);

      filtroBusqueda.OR = [
        ...(!isNaN(Number(searchTerms)) ? [{ pedido_id: Number(searchTerms) }] : []),
        {
          usuario: {
            AND: palabras.map((palabra: string) => ({
              OR: [
                { nombres: { contains: palabra } },
                { apellidos: { contains: palabra } }
              ]
            }))
          }
        }
      ];
    }

    let wherePrincipal: any = { ...filtroBusqueda };
    if (filtros.estado && filtros.estado !== 'todos') {
      wherePrincipal.estado = filtros.estado;
    }

    const [data, totalFiltrado, conteoEstados] = await Promise.all([
      prisma.pedido.findMany({
        where: wherePrincipal,
        skip: skip,
        take: limit,
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
      }),

      prisma.pedido.count({ where: wherePrincipal }),

      prisma.pedido.groupBy({
        by: ['estado'],
        where: filtroBusqueda,
        _count: {
          estado: true
        }
      })
    ]);

    const totalsByStatus = {
      Pendiente: 0,
      EnPreparacion: 0, 
      Listo: 0,
      Entregado: 0,
      Cancelado: 0
    };

    conteoEstados.forEach((grupo) => {
      if (grupo.estado in totalsByStatus) {
        totalsByStatus[grupo.estado] = grupo._count.estado;
      }
    });

    return {
      data,
      meta: {
        total: totalFiltrado,
        page,
        last_page: Math.ceil(totalFiltrado / limit),
        totalsByStatus
      }
    };
  }

  async findByUserId(
    userId: number,
    page: number,
    limit: number,
    search?: string
  ): Promise<PaginatedResult<any>> {
    const skip = (page - 1) * limit;

    let where: any = {
      usuario_id: userId
    };

    if (search && search.trim() !== '') {
      const searchTerms = search.trim();

      where.OR = [
        ...(!isNaN(Number(searchTerms)) ? [{ pedido_id: Number(searchTerms) }] : []),
        {
          detalles: {
            some: {
              producto: {
                nombre: {
                  contains: searchTerms,
                }
              }
            }
          }
        }
      ];
    }

    const [data, total] = await Promise.all([
      prisma.pedido.findMany({
        where: where,
        skip: skip,
        take: limit,
        select: {
          pedido_id: true,
          fecha_pedido: true,
          total: true,
          estado: true,
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
      }),
      prisma.pedido.count({ where })
    ]);

    return {
      data,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit)
      }
    };
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

  async findByKlapId(id: string): Promise<Pedido | null> {
    return await prisma.pedido.findFirst({
      where: { klap_order_id: id },
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