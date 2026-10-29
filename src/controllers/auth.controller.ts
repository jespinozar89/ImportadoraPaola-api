import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { CorreoService } from "../services/correo.service";
import { AuthRequest } from "@/middlewares/auth.middleware";
import { LoginDTO, UpdateUserDTO } from '../dtos/usuario.dto';
import { DuplicateUserDataError } from '../errors/duplicate-user-data.error';
import { ProfileRutError } from '../errors/profile-rut.error';
import {
  getAuthClearCookieOptions,
  getAuthCookieName,
  getAuthCookieOptions
} from "../utils/auth-cookie";

export class AuthController {

  constructor(
    private authService: AuthService,
    private correoService: CorreoService
  ) { }

  async register(req: Request, res: Response) {
    try {
      const result = await this.authService.register(req.body);

      this.correoService.enviarNotificacionBienvenida(
        result.email, 
        result.nombres
      )
      .catch(err => console.error(`[Register Correo Error] No se pudo enviar a ${result.email}:`, err.message));

      res.status(201).json(result);
    } catch (error: unknown) {
      if (error instanceof DuplicateUserDataError) {
        if (error.field === 'rut') {
          return res.status(409).json({
            message: 'Este RUT ya está asociado a una cuenta. Inicia sesión o recupera el acceso.'
          });
        }

        if (error.field === 'email') {
          return res.status(409).json({ message: 'El correo ya está registrado.' });
        }

        return res.status(409).json({
          message: 'No se pudo crear la cuenta porque uno de los datos ya está registrado.'
        });
      }

      if (error instanceof Error && error.message === 'El RUT ingresado no es válido.') {
        return res.status(400).json({ message: error.message });
      }

      console.error('Error inesperado al registrar usuario:', error);
      return res.status(500).json({
        message: 'No fue posible crear la cuenta. Intenta nuevamente más tarde.'
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const result = await this.authService.login(req.body);
      res.cookie(getAuthCookieName(), result.token, getAuthCookieOptions());
      res.status(200).json({ usuario: result.usuario });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error al iniciar sesión.";
      if (message.includes("TOKEN_EXPIRES_IN") || message.includes("clave secreta JWT")) {
        console.error("Error de configuración de autenticación:", message);
        return res.status(500).json({ message: "Error de configuración del servidor." });
      }
      res.status(401).json({ message });
    }
  }

  logout(_req: Request, res: Response) {
    res.clearCookie(getAuthCookieName(), getAuthClearCookieOptions());
    res.status(200).json({ message: "Sesión cerrada correctamente." });
  }

  async getPerfil(req: AuthRequest, res: Response) {
    try {
      const usuario = await this.authService.obtenerPerfil(req.usuarioId!);
      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.status(200).json(usuario);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el perfil" });
    }
  }

  async updatePerfil(req: AuthRequest, res: Response) {
    try {
      const {usuarioId, rol} = req;
      if (!usuarioId) throw new Error("Usuario no identificado");
      if (rol === 'administrador') throw new Error("Usuario no identificado");

      const LoginDTO: LoginDTO = {
        email: req.body.email,
        password: req.body.password
      };

      const userData: UpdateUserDTO = {
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        telefono: req.body.telefono,
        password: req.body.passwordNew
      };


      let usuario;
      const login = await this.authService.login(LoginDTO);

      if (login.token) {
        usuario = await this.authService.actualizarPerfil(usuarioId, userData, req.body.rut);
      }

      if (usuario) {
        this.correoService.enviarNotificacionUpdateDatos(
          usuario.email, 
          usuario.nombres
        )
        .catch(err => console.error(`[Update Perfil Correo Error] No se pudo enviar a ${usuario.email}:`, err.message));

        return res.status(200).json(usuario);
      }
      else {
        return res.status(404).json(null);
      }

    } catch (error: unknown) {
      if (error instanceof ProfileRutError) {
        if (error.reason === 'cannot_modify') {
          return res.status(403).json({
            message: "Tu RUT ya es válido y no puede modificarse por motivos de seguridad."
          });
        }
        return res.status(400).json({ message: "El RUT ingresado no es válido." });
      }

      console.error("Error en updatePerfil:", error);
      return res.status(404).json({ message: "Error al actualizar el perfil del usuario" });
    }

  }

  async generateResetToken(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ message: "El correo es requerido" });

      const token = await this.authService.generateResetToken(email);
      const usuario = await this.authService.findByEmail(email);

      if (!usuario) {
        return res.status(404).json({
          message: "Si el correo está registrado, recibirá un mensaje pronto."
        });
      }

      if(usuario.rol === 'administrador'){
        return res.status(404).json({
          message: "Si el correo está registrado, recibirá un mensaje pronto."
        });
      }

      this.correoService.enviarResetPassword(
        email,
        usuario.nombres,
        `${process.env.BASE_URL}/resetPassword?token=${token}`
      )
      .catch(err => console.error(`[Reset Token Correo Error] No se pudo enviar a ${email}:`, err.message));

      res.status(200).json({
        message: "Se ha enviado un enlace de recuperación a su correo"
      });
    } catch (error: any) {
      res.status(400).json({ message: "Si el correo está registrado, recibirá un mensaje pronto." });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {

      const { token, password } = req.body;

      if (!token || !password) {
        return res.status(400).json({ message: "Datos incompletos" });
      }

      await this.authService.resetPassword(token, password);

      res.status(200).json({
        message: "Contraseña restablecida correctamente"
      });

    } catch (error: any) {
      res.status(400).json({ message: 'Error al restablecer la contraseña' });
    }
  }

}