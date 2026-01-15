import  { PrismaClient, type Usuario } from "@prisma/client";
import type { IUsuarioRepository } from "../interfaces/usuario.repository.interface";
import { UpdateUserDTO, UsuarioPerfil } from "@/dtos/usuario.dto";

const prisma = new PrismaClient();

export class PrismaUsuarioRepository implements IUsuarioRepository {
  
  async create(data: any): Promise<Usuario> {
    return await prisma.usuario.create({ data });
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return await prisma.usuario.findUnique({ where: { email } });
  }

  async findById(id: number): Promise<UsuarioPerfil | null> {
    return await prisma.usuario.findUnique({
      where: { usuario_id: id },
      select: {
        usuario_id: true,
        nombres: true,
        apellidos: true,
        email: true,
        rol: true
      }
    });
  }


async updateProfile(userId: number, data: UpdateUserDTO): Promise<UsuarioPerfil | null> {

  return await prisma.usuario.update({
    where: { usuario_id: userId },
    data: {
      ...(data.nombres && { nombres: data.nombres }),
      ...(data.apellidos && { apellidos: data.apellidos }),
      ...(data.email && { email: data.email }),
      ...(data.telefono && { telefono: data.telefono }),
      ...(data.password && { password_hash: data.password })
    },
    select: {
      nombres: true,
      apellidos: true,
      email: true,
      telefono: true,
    }
  });
}

}