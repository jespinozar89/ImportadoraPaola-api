import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt, { SignOptions } from 'jsonwebtoken';
import type { IUsuarioRepository } from "../interfaces/usuario.repository.interface";
import type { CreateUserDTO, LoginDTO, UpdateUserDTO, UsuarioPerfil } from "../dtos/usuario.dto";
import { resetTokenDTO } from '../dtos/usuario.dto';
import { Usuario } from '@prisma/client';

export class AuthService {

  constructor(private usuarioRepository: IUsuarioRepository) { }

  async register(data: CreateUserDTO) {
    const existe = await this.usuarioRepository.findByEmail(data.email);
    if (existe) throw new Error("El correo ya está registrado");

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(data.password, salt);

    const nuevoUsuario = await this.usuarioRepository.create({
      nombres: data.nombres,
      apellidos: data.apellidos,
      email: data.email,
      telefono: data.telefono,
      password_hash: password_hash,
      rol: 'cliente'
    });

    const { password_hash: _, ...usuarioSinPass } = nuevoUsuario;
    return usuarioSinPass;
  }

  async login(data: LoginDTO) {
    const usuario = await this.usuarioRepository.findByEmail(data.email);
    if (!usuario) {
      throw new Error("Usuario y/o contraseña ingresados no coinciden con nuestros registros.");
    }

    if (usuario.bloqueado) {
      throw new Error("Tu cuenta ha sido bloqueada por seguridad debido a múltiples intentos fallidos. Por favor, restablece tu contraseña para desbloquearla.");
    }

    const validPass = await bcrypt.compare(data.password, usuario.password_hash);

    if (!validPass) {
      const MAX_ATTEMPTS = 5;
      await this.usuarioRepository.incrementFailedAttempts(
        usuario.usuario_id,
        usuario.intentos_fallidos,
        MAX_ATTEMPTS
      );

      const remainingAttempts = MAX_ATTEMPTS - (usuario.intentos_fallidos + 1);

      if (remainingAttempts <= 0) {
        throw new Error("Has superado el límite de intentos permitidos. Tu cuenta ha sido bloqueada. Restablece tu contraseña para volver a ingresar.");
      }

      throw new Error("Usuario y/o contraseña ingresados no coinciden con nuestros registros.");
    }

    await this.usuarioRepository.updateLastLogin(usuario.usuario_id);

    const jwtSecret: string = process.env.JWT_SECRET as string;
    const tokenExpiresIn = process.env.TOKEN_EXPIRES_IN || '1h';

    if (!jwtSecret) {
      throw new Error('La clave secreta JWT no está configurada en las variables de entorno.');
    }

    const token = jwt.sign(
      { id: usuario.usuario_id, rol: usuario.rol },
      jwtSecret,
      { expiresIn: tokenExpiresIn } as SignOptions
    );

    return {
      token,
      usuario: {
        id: usuario.usuario_id,
        email: usuario.email,
        telefono: usuario.telefono,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        rut: usuario.rut,
        dv: usuario.dv,
        rol: usuario.rol
      }
    };
  }

  async obtenerPerfil(id: number): Promise<UsuarioPerfil | null> {
    return this.usuarioRepository.findById(id);
  }

  async actualizarPerfil(id: number, data: UpdateUserDTO): Promise<UsuarioPerfil | null> {
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }
    return this.usuarioRepository.updateProfile(id, data);
  }

  async generateResetToken(email: string): Promise<string> {

    let resetTokenDTO: resetTokenDTO;

    const usuario = await this.usuarioRepository.findByEmail(email);
    if (!usuario) {
      throw new Error("Si el correo está registrado, recibirá un mensaje pronto.");
    }

    const token = crypto.randomBytes(32).toString('hex');

    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 15);

    resetTokenDTO = {
      email: email,
      token: token,
      tokenExpiry: expiry
    };

    return await this.usuarioRepository.generateResetToken(resetTokenDTO);
  }

  async resetPassword(token: string, newPassword: string): Promise<UsuarioPerfil | null> {
    const usuario = await this.usuarioRepository.findByToken(token);

    if (!usuario) {
      throw new Error("El enlace de recuperación no es válido.");
    }

    if (usuario.reset_token_expiry && new Date() > usuario.reset_token_expiry) {
      throw new Error("El enlace ha expirado. Por favor, solicita uno nuevo.");
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    return await this.usuarioRepository.unlockAccountAndUpdatePassword(
      usuario.usuario_id!,
      passwordHash
    );
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.usuarioRepository.findByEmail(email);
  }

  async findById(id: number): Promise<UsuarioPerfil | null> {
    return this.usuarioRepository.findById(id);
  }

}
