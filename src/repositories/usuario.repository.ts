import  { PrismaClient, type Usuario } from "@prisma/client";
import type { IUsuarioRepository } from "../interfaces/usuario.repository.interface";

const prisma = new PrismaClient();

export class PrismaUsuarioRepository implements IUsuarioRepository {
  
  async create(data: any): Promise<Usuario> {
    return await prisma.usuario.create({ data });
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return await prisma.usuario.findUnique({ where: { email } });
  }

  async findById(id: number): Promise<Usuario | null> {
    return await prisma.usuario.findUnique({ where: { usuario_id: id } });
  }
}