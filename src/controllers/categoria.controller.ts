import { Request, Response } from 'express';
import { CategoriaService } from '../services/categoria.service';
// Importamos la interfaz extendida del middleware para acceder a req.usuarioId/req.rol
import { AuthRequest } from '../middlewares/auth.middleware.js'; 
import { RequestHelpers } from '../utils/request-helpers';

export class CategoriaController {
  constructor(private categoriaService: CategoriaService) {}

  async create(req: AuthRequest, res: Response) {
    try {
      const categoria = await this.categoriaService.create(req.body);
      res.status(201).json(categoria);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const categorias = await this.categoriaService.findAll();
      res.status(200).json(categorias);
    } catch (error: any) {
      res.status(500).json({ message: 'Error al obtener categorías', error: error.message });
    }
  }
  
  async findById(req: Request, res: Response) {
    try {
      const id = RequestHelpers.getIdParam(req, res);
      if (id === null) return;

      const categoria = await this.categoriaService.findById(id);
      res.status(200).json(categoria);
    } catch (error: any) {
      res.status(404).json({ message: error.message }); // Error 404 si el servicio lanza "no encontrada"
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = RequestHelpers.getIdParam(req, res);
      if (id === null) return;

      const categoria = await this.categoriaService.update(id, req.body);
      res.status(200).json(categoria);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = RequestHelpers.getIdParam(req, res);
      if (id === null) return;

      await this.categoriaService.delete(id);
      res.status(200).json({ message: 'Categoría eliminada exitosamente' });
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }
}