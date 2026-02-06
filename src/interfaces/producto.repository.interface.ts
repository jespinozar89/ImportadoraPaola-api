import { CreateProductoDTO, PaginatedResult } from '@/dtos/producto.dto';
import { Producto, Prisma } from '@prisma/client';

export interface IProductoRepository {
  create(data: Prisma.ProductoCreateInput): Promise<Producto>;
  findAll(page: number, limit: number, filtros: any): Promise<PaginatedResult<Producto>>;
  findById(id: number): Promise<Producto | null>;
  findByCodigo(codigo: string): Promise<Producto | null>;
  update(id: number, data: Prisma.ProductoUpdateInput): Promise<Producto>;
  delete(id: number): Promise<Producto>;
  createBulk(productos: CreateProductoDTO[]): Promise<number>
}