import prisma from "../config/prisma";
import { Producto, Prisma } from '@prisma/client';
import { IProductoRepository } from '../interfaces/producto.repository.interface';
import { CreateProductoDTO, PaginatedResult } from '@/dtos/producto.dto';

export class PrismaProductoRepository implements IProductoRepository {

  async create(data: Prisma.ProductoCreateInput): Promise<Producto> {
    return await prisma.producto.create({ data });
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
        { nombre: { contains: filtros.search} },
        { producto_codigo: { contains: filtros.search} }
      ];
    }

    const [data, total] = await Promise.all([
      prisma.producto.findMany({
        where: where,
        skip: skip,
        take: limit,
        orderBy: { nombre: 'asc' },
        include: { categoria: true }
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
    return await prisma.producto.findUnique({ where: { producto_id: id } });
  }

  async findByCodigo(codigo: string): Promise<Producto | null> {
    return await prisma.producto.findFirst({
      where: { producto_codigo: codigo }
    });
  }

  async update(id: number, data: Prisma.ProductoUpdateInput): Promise<Producto> {
    return await prisma.producto.update({ where: { producto_id: id }, data });
  }

  async delete(id: number): Promise<Producto> {
    return await prisma.producto.delete({ where: { producto_id: id } });
  }

  async createBulk(productos: CreateProductoDTO[]): Promise<number> {
    const result = await prisma.producto.createMany({
      data: productos.map(p => ({
        nombre: p.nombre,
        descripcion: p.descripcion ?? null,
        imagen: p.imagen ?? null,
        precio:new Prisma.Decimal(p.precio),
        stock: p.stock,
        producto_codigo: p.producto_codigo ?? '',
        categoria_id: p.categoria_id
      })),
      skipDuplicates: true
    });

    return result.count;
  }

}