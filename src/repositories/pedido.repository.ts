import prisma from "../config/prisma";
import { Pedido, EstadoPedido, Prisma } from '@prisma/client';
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
        estado: data.estado as EstadoPedido,
        total: data.total,
        klap_order_id: data.klap_order_id ?? null,
        detalles: {
          create: data.detalles.map(d => ({
            producto_id: d.producto_id,
            cantidad: d.cantidad,
            precio_unitario: d.precio_unitario,
            precio_unitario_oferta: d.precio_unitario_oferta
              ? new Prisma.Decimal(d.precio_unitario_oferta)
              : null,
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

    let filtroBusqueda: any = {
      estado: {
        not: EstadoPedido.PendienteDeConfirmacion
      }
    };

    if (filtros.search && filtros.search.trim() !== '') {
      const searchTerms = filtros.search.trim();
      const palabras = searchTerms.split(/\s+/);

      filtroBusqueda.AND = [
        {
          OR: [
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
          ]
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
        totalsByStatus[grupo.estado as keyof typeof totalsByStatus] = grupo._count.estado;
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
      usuario_id: userId,
      estado: {
        not: EstadoPedido.PendienteDeConfirmacion
      }
    };

    if (search && search.trim() !== '') {
      const searchTerms = search.trim();

      where.AND = [
        {
          OR: [
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
          ]
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
                  imagenes: {
                    where: {
                      es_principal: true
                    },
                    take: 1,
                    select: {
                      url: true
                    }
                  }
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
          include: {
            producto: {
              include: {
                productoCategorias: {
                  include: {
                    categoria: true
                  }
                },
                imagenes: {
                  where: {
                    es_principal: true
                  },
                  take: 1,
                  select: {
                    imagen_id: true,
                    url: true,
                    es_principal: true
                  }
                }
              }
            }
          }
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
        detalles: {
          include: {
            producto: {
              include: {
                productoCategorias: {
                  include: {
                    categoria: true
                  }
                },
                imagenes: {
                  where: {
                    es_principal: true
                  },
                  take: 1,
                  select: {
                    imagen_id: true,
                    url: true,
                    es_principal: true
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  async findByKlapId(id: string): Promise<CreatePedidoDTO | null> {
    const pedido = await prisma.pedido.findFirst({
      where: { klap_order_id: id },
      include: {
        detalles: true
      }
    });

    if (!pedido) return null;

    return {
      usuario_id: pedido.usuario_id!,
      estado: pedido.estado as any,
      total: pedido.total.toNumber(),
      klap_order_id: pedido.klap_order_id || undefined,
      detalles: pedido.detalles.map(d => ({
        producto_id: d.producto_id,
        cantidad: d.cantidad,
        precio_unitario: d.precio_unitario.toNumber(),
        precio_unitario_oferta: d.precio_unitario_oferta?.toNumber() ?? null
      }))
    };
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

  async updateKlapOrderId(oldKlapOrderId: string, newKlapOrderId: string): Promise<any> {
    await prisma.pedido.updateMany({
      where: { klap_order_id: oldKlapOrderId },
      data: {
        klap_order_id: newKlapOrderId,
        estado: EstadoPedido.Pendiente,
        fecha_cambio_estado: new Date()
      }
    });

    const pedidoActualizado = await prisma.pedido.findFirst({
      where: { klap_order_id: newKlapOrderId },
      include: {
        usuario: {
          select: {
            email: true,
            nombres: true
          }
        },
        detalles: {
          include: {
            producto: {
              select: {
                nombre: true
              }
            }
          }
        }
      }
    });

    if (!pedidoActualizado) {
      throw new Error(`No se encontró el pedido con klap_order_id: ${newKlapOrderId}`);
    }

    const detallesFormateados = pedidoActualizado.detalles.map(d => ({
      pedido_id: d.pedido_id,
      nombre: d.producto?.nombre || '',
      producto_id: d.producto_id,
      cantidad: d.cantidad,
      precio_unitario: Number(d.precio_unitario),
      precio_unitario_oferta: d.precio_unitario_oferta ? Number(d.precio_unitario_oferta) : null
    }));

    return {
      pedido_id: pedidoActualizado.pedido_id,
      klap_order_id: pedidoActualizado.klap_order_id,
      usuario_id: pedidoActualizado.usuario_id,
      fecha_pedido: pedidoActualizado.fecha_pedido,
      fecha_cambio_estado: pedidoActualizado.fecha_cambio_estado,
      estado: pedidoActualizado.estado,
      total: Number(pedidoActualizado.total),
      usuario: pedidoActualizado.usuario,
      detalles: detallesFormateados
    };
  }
}