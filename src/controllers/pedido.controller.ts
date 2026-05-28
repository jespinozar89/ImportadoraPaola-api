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
        klap_order_id: req.body.klap_order_id
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
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const filtros = {
        estado: req.query.estado ? String(req.query.estado) : 'todos',
        search: req.query.search ? String(req.query.search) : undefined
      };

      const resultadoPaginado = await this.pedidoService.findAll(page, limit, filtros);

      return res.status(200).json(resultadoPaginado);

    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async findMyOrders(req: AuthRequest, res: Response) {
    try {
      const userId = req.usuarioId;
      if (!userId) {
        return res.status(401).json({ message: "Usuario no identificado" });
      }

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const search = req.query.search ? String(req.query.search) : undefined;

      const pedidosPaginados = await this.pedidoService.findByUserId(userId, page, limit, search);

      return res.status(200).json(pedidosPaginados);

    } catch (error: any) {
      return res.status(500).json({ message: error.message });
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
      const userRol = req.rol;
      const userId = req.usuarioId;

      if (id === null) return;

      let { estado } = req.body;
      if (!estado) throw new Error("Estado del pedido es requerido");
      if (!userId) throw new Error("Usuario no identificado");

      const pedidoUsuario = await this.pedidoService.findById(id);
      if (!pedidoUsuario) throw new Error("Pedido no encontrado");

      if (userRol === 'cliente') {
        if (pedidoUsuario.usuario_id !== userId) throw new Error("No tienes permiso para actualizar este pedido");
        if (pedidoUsuario.estado === EstadoPedido.Pendiente) {
          estado = EstadoPedido.Cancelado;
        }
        else {
          throw new Error("Error al actualizar el estado del pedido.");
        }
      }

      const pedido = await this.pedidoService.updateStatus(id, estado);

      if (pedido.estado === EstadoPedido.Cancelado) {
        const user = await this.authService.findById(pedidoUsuario.usuario_id!);
        if (!user) throw new Error("Usuario no encontrado");

        await this.correoService.enviarNotificacionReembolso(
          user.nombres!,
          pedidoUsuario.pedido_id.toString(),
          user.email!,
        );
      }

      res.status(200).json(pedido);
    }
    catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async CorreoStatus(req: AuthRequest, res: Response) {
    try {

      const { id, estado, adjuntoBase64, adjuntoNombre } = req.body;
      if (!estado) throw new Error("Estado del pedido es requerido");
      if (!id) throw new Error("ID del pedido es requerido");

      const estadosValidos = Object.values(EstadoPedido);
      if (!estadosValidos.includes(estado)) throw new Error("Estado inválido");

      const pedido = await this.pedidoService.findById(id);
      if (!pedido) throw new Error("Pedido no encontrado");
      if (pedido.estado === EstadoPedido.Pendiente) throw new Error("El pedido ya está pendiente");
      if (pedido.estado !== estado) throw new Error("El pedido no a cambiado de estado");

      const user = await this.authService.findById(pedido.usuario_id!);
      if (!user) throw new Error("Usuario no encontrado");

      let extension = null

      if (adjuntoNombre)
        extension = adjuntoNombre.split(".").pop()?.toLowerCase();

      let contentType: string;
      switch (extension) {
        case "pdf":
          contentType = "application/pdf";
          break;
        case "png":
          contentType = "image/png";
          break;
        case "jpg":
        case "jpeg":
          contentType = "image/jpeg";
          break;
        case null:
          contentType = "";
          break;
        default:
          throw new Error("Formato de archivo no permitido. Solo PDF o imágenes.");
      }

      const adjunto = adjuntoBase64 && adjuntoNombre
        ? {
          filename: adjuntoNombre,
          content: adjuntoBase64,
          contentType
        }
        : undefined;

      await this.correoService.enviarCambioEstadoPedido(
        user.email!,
        user.nombres!,
        estado,
        pedido.pedido_id.toString(),
        adjunto
      );

      res.status(200).json("Correo enviado exitosamente.");
    }
    catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}