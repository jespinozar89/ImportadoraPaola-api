import type  { Usuario } from "@prisma/client";

export interface IUsuarioRepository {
  create(data: any): Promise<Usuario>;
  findByEmail(email: string): Promise<Usuario | null>;
  findById(id: number): Promise<Usuario | null>;
}