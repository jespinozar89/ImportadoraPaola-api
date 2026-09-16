import { Response } from 'express';
import { DireccionService } from '../services/direccion.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { RequestHelpers } from '../utils/request-helpers';
import { CreateDireccionDTO, UpdateDireccionDTO } from '../dtos/direccion.dto';

export class DireccionController {
  constructor(private direccionService: DireccionService) {}

  async obtenerMisDirecciones(req: AuthRequest, res: Response) {
    try {
      const userId = req.usuarioId;
      if (!userId) {
        return res.status(401).json({ message: "Usuario no identificado" });
      }

      const direcciones = await this.direccionService.obtenerDireccionesPorUsuario(userId);
      return res.status(200).json(direcciones);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      const userId = req.usuarioId;
      if (!userId) {
        return res.status(401).json({ message: "Usuario no identificado" });
      }

      const { calle, numero, departamento, comuna, region, es_predeterminada } = req.body;

      if (!calle || !numero || !comuna || !region) {
        return res.status(400).json({
          message: "Los campos calle, número, comuna y región son obligatorios."
        });
      }

      const dto: CreateDireccionDTO = {
        usuario_id: userId,
        calle,
        numero,
        departamento,
        comuna,
        region,
        es_predeterminada
      };

      const nuevaDireccion = await this.direccionService.crearDireccion(dto);
      return res.status(201).json(nuevaDireccion);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const id = RequestHelpers.getIdParam(req, res);
      const userId = req.usuarioId;

      if (id === null) return;
      if (!userId) {
        return res.status(401).json({ message: "Usuario no identificado" });
      }

      const dto: UpdateDireccionDTO = req.body;
      const direccionActualizada = await this.direccionService.actualizarDireccion(id, userId, dto);

      return res.status(200).json(direccionActualizada);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      const id = RequestHelpers.getIdParam(req, res);
      const userId = req.usuarioId;

      if (id === null) return;
      if (!userId) {
        return res.status(401).json({ message: "Usuario no identificado" });
      }

      const resultado = await this.direccionService.eliminarDireccion(id, userId);
      return res.status(200).json(resultado);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async marcarPredeterminada(req: AuthRequest, res: Response) {
    try {
      const id = RequestHelpers.getIdParam(req, res);
      const userId = req.usuarioId;

      if (id === null) return;
      if (!userId) {
        return res.status(401).json({ message: "Usuario no identificado" });
      }

      const actualizada = await this.direccionService.cambiarPredeterminada(id, userId);
      return res.status(200).json(actualizada);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}