import prisma from "../config/prisma";
import { Producto, Prisma } from '@prisma/client';
import { IProductoRepository } from '../interfaces/producto.repository.interface';
import { CreateProductoDTO, UpdateProductoDTO } from '@/dtos/producto.dto';
import { PaginatedResult } from "@/dtos/paginated.dto";

export class PrismaProductoRepository implements IProductoRepository {

  async create(data: CreateProductoDTO): Promise<Producto> {
    const { imagenes, categoria_id, ...restOfData } = data;

    return await prisma.producto.create({
      data: {
        ...restOfData,
        precio: new Prisma.Decimal(data.precio),
        producto_codigo: data.producto_codigo ?? '',

        ...(categoria_id ? { categoria: { connect: { categoria_id } } } : {}),

        ...(imagenes && imagenes.length > 0
          ? {
            imagenes: {
              create: imagenes.map((img, index) => ({
                url: img.url,
                es_principal: img.es_principal ?? index === 0,
                orden: img.orden ?? index + 1,
              })),
            },
          }
          : {}),
      },
      include: {
        categoria: true,
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

    if (filtros.estado && filtros.estado !== 'todos') {
      where.categoria = { estado: filtros.estado };
    }

    if (filtros.categoria_id) {
      where.categoria_id = Number(filtros.categoria_id);
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
          categoria: true,
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
        categoria: true,
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
      producto_id,
      ...restOfData
    } = data;

    return await prisma.producto.update({
      where: {
        producto_id: Number(id)
      },
      data: {
        ...restOfData,
        precio: restOfData.precio ? new Prisma.Decimal(restOfData.precio) : undefined,

        ...(categoria_id ? { categoria: { connect: { categoria_id: Number(categoria_id) } } } : {}),

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
        categoria: true,
        imagenes: {
          orderBy: [
            { es_principal: 'desc' },
            { orden: 'asc' }
          ]
        },
      },
    });
  }

  async delete(id: number): Promise<Producto> {
    return await prisma.producto.delete({ where: { producto_id: id } });
  }

  async createBulk(productos: CreateProductoDTO[]): Promise<number> {
    const result = await prisma.producto.createMany({
      data: productos.map(p => ({
        nombre: p.nombre,
        descripcion: p.descripcion ?? null,
        precio: new Prisma.Decimal(p.precio),
        stock: p.stock,
        producto_codigo: p.producto_codigo ?? '',
        categoria_id: p.categoria_id
      })),
      skipDuplicates: true
    });

    return result.count;
  }

}