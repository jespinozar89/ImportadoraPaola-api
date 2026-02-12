import { Response } from 'express';
import { FavoritoService } from '../services/favorito.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class FavoritoController {
  constructor(private favoritoService: FavoritoService) {}

  async add(req: AuthRequest, res: Response) {
    try {
      const usuarioId = req.usuarioId;
      if (!usuarioId) throw new Error("Usuario no identificado");

      const favorito = await this.favoritoService.addFavorito(usuarioId, req.body);
      res.status(201).json(favorito);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async remove(req: AuthRequest, res: Response) {
    try {
      const usuarioId = req.usuarioId;
      if (!usuarioId) throw new Error("Usuario no identificado");

      const productoIdStr = req.params.productoId;
      if (!productoIdStr) throw new Error("ID de producto no proporcionado");

      const productoId = parseInt(String(productoIdStr), 10);
      if (Number.isNaN(productoId)) throw new Error("ID de producto inválido");
      
      await this.favoritoService.removeFavorito(usuarioId, productoId);
      res.status(200).json({ message: "Producto eliminado de favoritos" });
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  async getAll(req: AuthRequest, res: Response) {
    try {
      const usuarioId = req.usuarioId;
      if (!usuarioId) throw new Error("Usuario no identificado");

      const favoritos = await this.favoritoService.getMyFavoritos(usuarioId);
      res.status(200).json(favoritos);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}