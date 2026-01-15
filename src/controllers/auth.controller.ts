import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { AuthRequest } from "@/middlewares/auth.middleware";

export class AuthController {
  constructor(private authService: AuthService) {}

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
    try { const usuario = await this.authService.obtenerPerfil(req.usuarioId!); 
      if (!usuario) { 
        return res.status(404).json({ message: "Usuario no encontrado" }); 
      } 
      
      res.json(usuario); 
    } catch (error) { 
      res.status(500).json({ message: "Error al obtener el perfil" }); 
    } 
  }

  async updatePerfil(req: AuthRequest, res: Response) {
    try {
      const usuarioId = req.usuarioId;
      if (!usuarioId) throw new Error("Usuario no identificado");

      const usuario = await this.authService.actualizarPerfil(usuarioId, req.body);
      res.json(usuario);
    }catch(error){
      res.status(500).json({ message: "Error al actualizar el perfil" });
    }
  }
}