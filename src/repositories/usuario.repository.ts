import prisma from "../config/prisma";
import { type Usuario } from "@prisma/client";
import type { IUsuarioRepository } from "../interfaces/usuario.repository.interface";
import { UpdateUserDTO, UsuarioPerfil } from "@/dtos/usuario.dto";
import { resetTokenDTO } from '../dtos/usuario.dto';

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
        telefono: true,
        email: true,
        rol: true
      }
    });
  }

  async findByToken(token: string): Promise<UsuarioPerfil | null> {
    return await prisma.usuario.findUnique({
      where: { reset_token: token},
      select: {
        usuario_id: true,
        nombres: true,
        apellidos: true,
        telefono: true,
        email: true,
        reset_token_expiry: true,
      }
    });
  }

  async updateProfile(userId: number, data: UpdateUserDTO): Promise<UsuarioPerfil | null> {

    return await prisma.usuario.update({
      where: { usuario_id: userId },
      data: {
        ...(data.nombres && { nombres: data.nombres }),
        ...(data.apellidos && { apellidos: data.apellidos }),
        ...(data.telefono && { telefono: data.telefono }),
        ...(data.password && { password_hash: data.password }),
        reset_token: null,
        reset_token_expiry: null
      },
      select: {
        nombres: true,
        apellidos: true,
        email: true,
        telefono: true,
      }
    });
  }

  async generateResetToken(resetToken: resetTokenDTO): Promise<string> {
    return await prisma.usuario.update({
      where: { email: resetToken.email },
      data: {
        reset_token: resetToken.token,
        reset_token_expiry: resetToken.tokenExpiry
      },
      select: {
        reset_token: true
      }
    }).then(result => result.reset_token || '');

  }


}