import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import type { IUsuarioRepository } from "../interfaces/usuario.repository.interface";
import type { CreateUserDTO, LoginDTO, UpdateUserDTO, UsuarioPerfil } from "../dtos/usuario.dto";

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
    if (!usuario) throw new Error("Credenciales inválidas");

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
}
