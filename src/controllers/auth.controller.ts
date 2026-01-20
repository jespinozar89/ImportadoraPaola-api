import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { AuthRequest } from "@/middlewares/auth.middleware";
import { LoginDTO, UpdateUserDTO } from '../dtos/usuario.dto';
import e from "express";

export class AuthController {
  constructor(private authService: AuthService) { }

  async register(req: Request, res: Response) {
    try {
      const result = await this.authService.register(req.body);
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
      const usuarioId = req.usuarioId;
      if (!usuarioId) throw new Error("Usuario no identificado");

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
        res.status(200).json(usuario);
      }
      else {
        res.status(404).json(null);
      }

    } catch (error: any) {
      let msg = "Error al actualizar el perfil del usuario";
      let status = 400;

      if (typeof error?.message === "string") {
        const mensaje = error.message.trim();

        if (mensaje === "Credenciales inválidas") {
          msg = mensaje;
          status = 401;
        } else if (mensaje === "Correo no registrado") {
          msg = mensaje;
          status = 404;
        }
      }

      console.error("Error en updatePerfil:", error);
      res.status(status).json({ message: msg });
    }

  }

  async generateResetToken(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ message: "El correo es requerido" });

      const token = await this.authService.generateResetToken(email);

      // llamar mi servicio de correo
      console.log(`Enviar a ${email}: http://localhost:4200/reset-password?token=${token}`);

      res.status(200).json({
        message: "Se ha enviado un enlace de recuperación a su correo",
        //debo borrar esto , cuando implemente el servicio correo
        linkToken: `http://localhost:4200/resetPassword?token=${token}`
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