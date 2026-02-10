import { Response } from 'express';
import { PedidoService } from '../services/pedido.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { RequestHelpers } from '../utils/request-helpers';
import { CreatePedidoDTO, EstadoPedido } from '../dtos/pedido.dto';
import { CorreoService } from '@/services/correo.service';
import { AuthService } from '@/services/auth.service';

export class PedidoController {
  constructor(
    private pedidoService: PedidoService,
    private authService: AuthService,
    private correoService: CorreoService
  ) { }

  async create(req: AuthRequest, res: Response) {
    try {

      const userId = req.usuarioId;
      if (!userId) throw new Error("Usuario no identificado");

      const user = await this.authService.findById(userId);

      const pedidoData: CreatePedidoDTO = {
        usuario_id: userId,
        total: req.body.total,
        detalles: req.body.detalles,
        comprobante_pago: req.body.comprobante_pago
      };

      const pedido = await this.pedidoService.create(pedidoData);

      await this.correoService.enviarConfirmacionPedido(user?.email!, {
        id_pedido: pedido.pedido_id,
        usuario_nombre: user?.nombres!,
        productos: pedidoData.detalles,
        total: Number(pedido.total)
      });
      
      res.status(201).json(pedido);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async findAll(req: AuthRequest, res: Response) {
    try {
      const pedidos = await this.pedidoService.findAll();
      res.status(200).json(pedidos);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async findMyOrders(req: AuthRequest, res: Response) {
    try {
      const userId = req.usuarioId;
      if (!userId) throw new Error("Usuario no identificado");
      const pedidos = await this.pedidoService.findByUserId(userId);
      res.status(200).json(pedidos);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async findOrderByUserIdAndPedidoId(req: AuthRequest, res: Response) {
    try {
      const orderId = RequestHelpers.getIdParam(req, res);
      const userId = req.usuarioId;

      if (orderId === null) return;
      if (!userId) throw new Error("Usuario no identificado");

      const pedido = await this.pedidoService.findOrderByUserIdAndPedidoId(userId, orderId);
      res.status(200).json(pedido);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  async findById(req: AuthRequest, res: Response) {
    try {
      const id = RequestHelpers.getIdParam(req, res);
      if (id === null) return;

      const pedido = await this.pedidoService.findById(id);
      res.status(200).json(pedido);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  async updateStatus(req: AuthRequest, res: Response) {
    try {
      const id = RequestHelpers.getIdParam(req, res);
      if (id === null) return;

      const { estado } = req.body;
      if (!estado) throw new Error("Estado del pedido es requerido");

      const pedido = await this.pedidoService.updateStatus(id, estado);
      res.status(200).json(pedido);
    }
    catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async CorreoStatus(req: AuthRequest, res: Response) {
    try {

      const { id, estado } = req.body;
      if (!estado) throw new Error("Estado del pedido es requerido");
      if (!id) throw new Error("ID del pedido es requerido");

      const estadosValidos = Object.values(EstadoPedido); 
      if (!estadosValidos.includes(estado)) throw new Error("Estado inválido"); 

      const pedido = await this.pedidoService.findById(id);
      if (!pedido) throw new Error("Pedido no encontrado");
      if(pedido.estado === EstadoPedido.Pendiente) throw new Error("El pedido ya está pendiente");
      if(pedido.estado !== estado) throw new Error("El pedido no a cambiado de estado");

      const user = await this.authService.findById(pedido.usuario_id!);
      if (!user) throw new Error("Usuario no encontrado");

      await this.correoService.enviarCambioEstadoPedido(
        user.email!,
        user.nombres!,
        estado,
        pedido.pedido_id.toString()
      );

      res.status(200).json("Correo enviado exitosamente.");
    }
    catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}