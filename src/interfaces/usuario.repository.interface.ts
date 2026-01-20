import { UpdateUserDTO, UsuarioPerfil } from "@/dtos/usuario.dto";
import type  { Usuario } from "@prisma/client";
import { resetTokenDTO } from '../dtos/usuario.dto';

export interface IUsuarioRepository {
  create(data: any): Promise<Usuario>;
  findByEmail(email: string): Promise<Usuario | null>;
  findById(id: number): Promise<UsuarioPerfil | null>;
  findByToken(token: string): Promise<UsuarioPerfil | null>;
  updateProfile(userId: number, data: UpdateUserDTO): Promise<UsuarioPerfil | null>;
  generateResetToken(resetToken: resetTokenDTO): Promise<string>;
}