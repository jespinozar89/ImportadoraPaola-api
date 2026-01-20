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
    if (!usuario) throw new Error("Correo no registrado");

    const validPass = await bcrypt.compare(data.password, usuario.password_hash);
    if (!validPass) throw new Error("Credenciales inválidas");

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
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
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

    if (usuario.reset_token_expiry && newPassword && new Date() > usuario.reset_token_expiry) {
      throw new Error("El enlace ha expirado. Por favor, solicita uno nuevo.");
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    return await this.usuarioRepository.updateProfile(usuario.usuario_id!, { password: passwordHash });
  }
}
