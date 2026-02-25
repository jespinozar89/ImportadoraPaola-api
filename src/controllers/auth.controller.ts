import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { CorreoService } from "../services/correo.service";
import { AuthRequest } from "@/middlewares/auth.middleware";
import { LoginDTO, UpdateUserDTO } from '../dtos/usuario.dto';

export class AuthController {

  constructor(
    private authService: AuthService,
    private correoService: CorreoService
  ) { }

  async register(req: Request, res: Response) {
    try {
      const result = await this.authService.register(req.body);
      this.correoService.enviarNotificacionBienvenida(result.email, result.nombres);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const result = await this.authService.login(req.body);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
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
        usuario = await this.authService.actualizarPerfil(usuarioId, userData);
      }

      if (usuario) {
        this.correoService.enviarNotificacionUpdateDatos(usuario.email, usuario.nombres);
        return res.status(200).json(usuario);
      }
      else {
        return res.status(404).json(null);
      }

    } catch (error: any) {
      let msg = "Error al actualizar el perfil del usuario";
      console.error("Error en updatePerfil:", error);
      return res.status(404).json({ message: msg });
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
      );

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