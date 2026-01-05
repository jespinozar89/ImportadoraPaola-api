import { PrismaClient, Producto, Prisma } from '@prisma/client';
import { IProductoRepository } from '../interfaces/producto.repository.interface';

const prisma = new PrismaClient();

export class PrismaProductoRepository implements IProductoRepository {

  async create(data: Prisma.ProductoCreateInput): Promise<Producto> {
    return await prisma.producto.create({ data });
  }

  async findAll(): Promise<Producto[]> {
    const productos = await prisma.producto.findMany({
      include: {
        categoria: true,
      }
    });

    return productos.map(prod => ({
      ...prod,
      categoria_nombre: prod.categoria?.nombre ?? ''
    }));
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
}