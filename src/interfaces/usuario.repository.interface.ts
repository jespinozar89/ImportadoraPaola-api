import type  { Usuario } from "@prisma/client";
//import type { CreateUserDTO } from "../dtos/usuario.dto.js";

export interface IUsuarioRepository {
  create(data: any): Promise<Usuario>; // 'data' será tipado según Prisma
  findByEmail(email: string): Promise<Usuario | null>;
  findById(id: number): Promise<Usuario | null>;
}