import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { IUsuarioRepository } from "../interfaces/usuario.repository.interface";
import type { CreateUserDTO, LoginDTO } from "../dtos/usuario.dto";

export class AuthService {
  // Inyección de dependencias: El servicio NO crea el repo, lo recibe.
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async register(data: CreateUserDTO) {
    const existe = await this.usuarioRepository.findByEmail(data.email);
    if (existe) throw new Error("El correo ya está registrado");

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(data.password, salt);

    // Preparamos datos para Prisma (excluyendo password plano)
    const nuevoUsuario = await this.usuarioRepository.create({
      nombres: data.nombres,
      apellidos: data.apellidos,
      email: data.email,
      telefono: data.telefono,
      password_hash: password_hash,
      rol: 'cliente' // Default
    });

    // Eliminamos password del objeto de retorno
    const { password_hash: _, ...usuarioSinPass } = nuevoUsuario;
    return usuarioSinPass;
  }

  async login(data: LoginDTO) {
    const usuario = await this.usuarioRepository.findByEmail(data.email);
    if (!usuario) throw new Error("Credenciales inválidas");

    const validPass = await bcrypt.compare(data.password, usuario.password_hash);
    if (!validPass) throw new Error("Credenciales inválidas");

    // Generar JWT
    const token = jwt.sign(
      { id: usuario.usuario_id, rol: usuario.rol },
      process.env.JWT_SECRET || 'secreto',
      { expiresIn: '24h' }
    );

    return { token, usuario: { id: usuario.usuario_id, email: usuario.email } };
  }
}
