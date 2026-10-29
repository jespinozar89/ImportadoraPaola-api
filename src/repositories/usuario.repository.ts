import prisma from "../config/prisma";
import { type Usuario } from "@prisma/client";
import type { IUsuarioRepository } from "../interfaces/usuario.repository.interface";
import { UpdateUserDTO, UsuarioPerfil } from "@/dtos/usuario.dto";
import { resetTokenDTO } from '../dtos/usuario.dto';
import { Prisma } from '@prisma/client';
import { DuplicateUserDataError } from '../errors/duplicate-user-data.error';

export class PrismaUsuarioRepository implements IUsuarioRepository {

  async create(data: any): Promise<Usuario> {
    try {
      return await prisma.usuario.create({ data });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const target = error.meta?.target;
        const fields = Array.isArray(target)
          ? target.map(String).join(' ').toLowerCase()
          : typeof target === 'string'
            ? target.toLowerCase()
            : '';

        const field = fields.includes('rut')
          ? 'rut'
          : fields.includes('email')
            ? 'email'
            : 'unknown';

        throw new DuplicateUserDataError(field);
      }

      throw error;
    }
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
        rut: true,
        dv: true,
        rol: true
      }
    });
  }

  async findByToken(token: string): Promise<UsuarioPerfil | null> {
    return await prisma.usuario.findUnique({
      where: { reset_token: token },
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
        ...(data.rut !== undefined && { rut: data.rut }),
        ...(data.dv !== undefined && { dv: data.dv }),
        ...(data.password && { password_hash: data.password }),
        reset_token: null,
        reset_token_expiry: null
      },
      select: {
        nombres: true,
        apellidos: true,
        email: true,
        telefono: true,
        rut: true,
        dv: true,
      }
    });
  }

  async updateLastLogin(userId: number): Promise<void> {
    await prisma.usuario.update({
      where: { usuario_id: userId },
      data: {
        ultima_conexion: new Date(),
        intentos_fallidos: 0,
        bloqueado: false
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

  async incrementFailedAttempts(userId: number, currentAttempts: number, maxAttempts: number): Promise<void> {
    const newAttempts = currentAttempts + 1;
    const shouldLock = newAttempts >= maxAttempts;

    await prisma.usuario.update({
      where: { usuario_id: userId },
      data: {
        intentos_fallidos: newAttempts,
        bloqueado: shouldLock
      }
    });
  }

  async unlockAccountAndUpdatePassword(userId: number, passwordHash: string): Promise<UsuarioPerfil | null> {
    return await prisma.usuario.update({
      where: { usuario_id: userId },
      data: {
        password_hash: passwordHash,
        reset_token: null,
        reset_token_expiry: null,
        intentos_fallidos: 0,
        bloqueado: false
      },
      select: {
        nombres: true,
        apellidos: true,
        email: true,
        telefono: true
      }
    });
  }


}