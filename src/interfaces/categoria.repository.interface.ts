import { Categoria, Prisma } from '@prisma/client';

export interface ICategoriaRepository {
  create(data: Prisma.CategoriaCreateInput): Promise<Categoria>;
  findAll(): Promise<Categoria[]>;
  findById(id: number): Promise<Categoria | null>;
  update(id: number, data: Prisma.CategoriaUpdateInput): Promise<Categoria>;
  // Usaremos delete para hacer un "soft delete" (cambiar estado a Inactivo)
  delete(id: number): Promise<Categoria>; 
}