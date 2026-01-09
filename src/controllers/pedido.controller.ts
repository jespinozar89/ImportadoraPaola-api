import { Response } from 'express';
import { PedidoService } from '../services/pedido.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { RequestHelpers } from '../utils/request-helpers';
import { CreatePedidoDTO } from '@/dtos/pedido.dto';

export class PedidoController {
  constructor(private pedidoService: PedidoService) {}

  async create(req: AuthRequest, res: Response) {
    try {

      const userId = req.usuarioId;
      if (!userId) throw new Error("Usuario no identificado");

      const pedidoData: CreatePedidoDTO = {
        usuario_id: userId,
        total: req.body.total,
        detalles: req.body.detalles
      };

      const pedido = await this.pedidoService.create(pedidoData);
      res.status(201).json(pedido);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async findAll(req: AuthRequest, res: Response) {
    try {
      const pedidos = await this.pedidoService.findAll();
      res.json(pedidos);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async findMyOrders(req: AuthRequest, res: Response) {
    try {
        const userId = req.usuarioId;
        if (!userId) throw new Error("Usuario no identificado");
        const pedidos = await this.pedidoService.findByUserId(userId);
        res.json(pedidos);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
  }
  
  async findById(req: AuthRequest, res: Response) {
      try {
          const id = RequestHelpers.getIdParam(req, res);
          if (id === null) return;
                      
          const pedido = await this.pedidoService.findById(id);
          res.json(pedido);
      } catch (error: any) {
          res.status(404).json({ message: error.message });
      }
  }
}