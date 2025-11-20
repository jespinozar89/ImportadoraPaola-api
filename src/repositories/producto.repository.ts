import { PrismaClient, Producto, Prisma } from '@prisma/client';
import { IProductoRepository } from '../interfaces/producto.repository.interface';

const prisma = new PrismaClient();

export class PrismaProductoRepository implements IProductoRepository {
    
  async create(data: Prisma.ProductoCreateInput): Promise<Producto> {
    return await prisma.producto.create({ data });
  }

  async findAll(): Promise<Producto[]> {
    return await prisma.producto.findMany({
      // Incluimos la categoría para que el frontend pueda mostrar el nombre
      include: {
        categoria: true, 
      }
    });
  }

  async findById(id: number): Promise<Producto | null> {
    return await prisma.producto.findUnique({ where: { producto_id: id } });
  }

  async update(id: number, data: Prisma.ProductoUpdateInput): Promise<Producto> {
    return await prisma.producto.update({ where: { producto_id: id }, data });
  }

  async delete(id: number): Promise<Producto> {
    // Eliminación física del registro
    return await prisma.producto.delete({ where: { producto_id: id } });
  }
}