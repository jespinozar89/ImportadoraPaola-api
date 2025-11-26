import { Producto, Prisma } from '@prisma/client';

export interface IProductoRepository {
  create(data: Prisma.ProductoCreateInput): Promise<Producto>;
  findAll(): Promise<Producto[]>;
  findById(id: number): Promise<Producto | null>;
  findByCodigo(codigo: string): Promise<Producto | null>;
  update(id: number, data: Prisma.ProductoUpdateInput): Promise<Producto>;
  delete(id: number): Promise<Producto>;
}