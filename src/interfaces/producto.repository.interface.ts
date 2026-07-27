import { PaginatedResult } from '@/dtos/paginated.dto';
import { CreateProductoDTO, UpdateProductoDTO } from '@/dtos/producto.dto';
import { Producto } from '@prisma/client';

export interface IProductoRepository {
  create(data: CreateProductoDTO): Promise<Producto>;
  findAll(page: number, limit: number, filtros: any): Promise<PaginatedResult<Producto>>;
  findById(id: number): Promise<Producto | null>;
  findByCodigo(codigo: string): Promise<Producto | null>;
  update(id: number, data: UpdateProductoDTO | any): Promise<Producto>;
  delete(id: number): Promise<Producto>;
  createBulk(productos: CreateProductoDTO[]): Promise<number>
}