import prisma from "../config/prisma";
import { Producto, Prisma } from '@prisma/client';
import { IProductoRepository } from '../interfaces/producto.repository.interface';
import { CreateProductoDTO, UpdateProductoDTO } from '@/dtos/producto.dto';
import { PaginatedResult } from "@/dtos/paginated.dto";

export class PrismaProductoRepository implements IProductoRepository {

  async create(data: CreateProductoDTO): Promise<Producto> {
    const { imagenes, categoria_id, categoria_ids, ...restOfData } = data as any;

    // Soportar tanto categoria_ids: [1, 2] como un categoria_id individual
    const idsCategorias: number[] = categoria_ids && Array.isArray(categoria_ids)
      ? categoria_ids
      : (categoria_id ? [Number(categoria_id)] : []);

    return await prisma.producto.create({
      data: {
        ...restOfData,
        precio: new Prisma.Decimal(data.precio),
        ...(data.precio_oferta !== undefined && data.precio_oferta !== null
          ? { precio_oferta: new Prisma.Decimal(data.precio_oferta) }
          : { precio_oferta: null }),
        producto_codigo: data.producto_codigo ?? '',

        ...(idsCategorias.length > 0
          ? {
            productoCategorias: {
              create: idsCategorias.map((id: number) => ({
                categoria_id: Number(id)
              }))
            }
          }
          : {}),

        ...(imagenes && imagenes.length > 0
          ? {
            imagenes: {
              create: imagenes.map((img: any, index: number) => ({
                url: img.url,
                es_principal: img.es_principal ?? index === 0,
                orden: img.orden ?? index + 1,
              })),
            },
          }
          : {}),
      },
      include: {
        productoCategorias: {
          include: {
            categoria: true
          }
        },
        imagenes: {
          orderBy: [
            { es_principal: 'desc' },
            { orden: 'asc' }
          ]
        },
      },
    });
  }

  async findAll(page: number, limit: number, filtros: any): Promise<PaginatedResult<Producto>> {
    const skip = (page - 1) * limit;

    let where: any = {};

    // Filtrar productos que tengan al menos una categoría en estado Activo/Inactivo
    if (filtros.estado && filtros.estado !== 'todos') {
      where.productoCategorias = {
        some: {
          categoria: { estado: filtros.estado }
        }
      };
    }

    // Filtrar productos por ID de categoría
    if (filtros.categoria_id) {
      where.productoCategorias = {
        some: {
          categoria_id: Number(filtros.categoria_id)
        }
      };
    }

    if (filtros.search) {
      where.OR = [
        { nombre: { contains: filtros.search } },
        { producto_codigo: { contains: filtros.search } }
      ];
    }

    const [data, total] = await Promise.all([
      prisma.producto.findMany({
        where: where,
        skip: skip,
        take: limit,
        orderBy: { nombre: 'asc' },
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
      }),
      prisma.producto.count({ where })
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

  async findById(id: number): Promise<Producto | null> {
    return await prisma.producto.findUnique({
      where: { producto_id: id },
      include: {
        productoCategorias: {
          include: {
            categoria: true
          }
        },
        imagenes: {
          select: {
            imagen_id: true,
            url: true,
            es_principal: true,
            orden: true
          },
          orderBy: [
            { es_principal: 'desc' },
            { orden: 'asc' }
          ]
        }
      }
    });
  }

  async findByCodigo(codigo: string): Promise<Producto | null> {
    return await prisma.producto.findFirst({
      where: { producto_codigo: codigo }
    });
  }

  async update(id: number, data: UpdateProductoDTO | any): Promise<Producto> {
    const {
      imagenes,
      categoria,
      categoria_id,
      categoria_ids,
      productoCategorias,
      producto_id,
      ...restOfData
    } = data;

    // Determinar si vienen nuevas categorías
    const idsCategorias: number[] | null = categoria_ids && Array.isArray(categoria_ids)
      ? categoria_ids.map(Number)
      : (categoria_id ? [Number(categoria_id)] : null);

    return await prisma.$transaction(async (tx) => {
      // 1. Si se actualizaron las categorías, eliminar las asignaciones anteriores
      if (idsCategorias !== null) {
        await tx.productoCategoria.deleteMany({
          where: { producto_id: Number(id) }
        });
      }

      // 2. Actualizar producto y recrear relaciones
      return await tx.producto.update({
        where: {
          producto_id: Number(id)
        },
        data: {
          ...restOfData,
          precio: restOfData.precio ? new Prisma.Decimal(restOfData.precio) : undefined,

          ...(restOfData.precio_oferta !== undefined
            ? { precio_oferta: restOfData.precio_oferta ? new Prisma.Decimal(restOfData.precio_oferta) : null }
            : {}),

          ...(idsCategorias !== null && idsCategorias.length > 0
            ? {
              productoCategorias: {
                create: idsCategorias.map((catId: number) => ({
                  categoria_id: catId
                }))
              }
            }
            : {}),

          ...(imagenes ? {
            imagenes: {
              deleteMany: {},
              create: imagenes.map((img: any, index: number) => ({
                url: img.url,
                es_principal: img.es_principal ?? index === 0,
                orden: img.orden ?? index + 1,
              })),
            },
          } : {}),
        },
        include: {
          productoCategorias: {
            include: {
              categoria: true
            }
          },
          imagenes: {
            orderBy: [
              { es_principal: 'desc' },
              { orden: 'asc' }
            ]
          },
        },
      });
    });
  }

  async delete(id: number): Promise<Producto> {
    return await prisma.producto.delete({ where: { producto_id: id } });
  }

  async createBulk(productos: CreateProductoDTO[]): Promise<number> {
    return await prisma.$transaction(async (tx) => {
      let count = 0;

      for (const p of productos) {
        const { categoria_id, categoria_ids } = p as any;

        const idsCategorias: number[] = categoria_ids && Array.isArray(categoria_ids)
          ? categoria_ids
          : (categoria_id ? [Number(categoria_id)] : []);

        const nuevoProducto = await tx.producto.create({
          data: {
            nombre: p.nombre,
            descripcion: p.descripcion ?? null,
            precio: new Prisma.Decimal(p.precio),
            stock: p.stock,
            producto_codigo: p.producto_codigo ?? '',
            ...(idsCategorias.length > 0
              ? {
                productoCategorias: {
                  create: idsCategorias.map((id: number) => ({
                    categoria_id: Number(id)
                  }))
                }
              }
              : {})
          }
        });

        if (nuevoProducto) count++;
      }

      return count;
    });
  }

  async deductStock(detalles: Array<{ producto_id: number; cantidad: number }>): Promise<void> {
    await prisma.$transaction(
      detalles.map((item) =>
        prisma.producto.update({
          where: {
            producto_id: item.producto_id,
            stock: {
              gte: item.cantidad
            }
          },
          data: {
            stock: {
              decrement: item.cantidad
            }
          }
        })
      )
    );
  }

  async filterWithStock(productoIds: number[]): Promise<number[]> {
    if (!productoIds || productoIds.length === 0) return [];

    const productosConStock = await prisma.producto.findMany({
      where: {
        producto_id: {
          in: productoIds
        },
        stock: {
          gt: 0
        }
      },
      select: {
        producto_id: true
      }
    });

    return productosConStock.map(p => p.producto_id);
  }

}