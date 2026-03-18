import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { KlapService } from "../services/klap.service";
import { PedidoService } from '../services/pedido.service';
import { EstadoPedido } from '../dtos/pedido.dto';

export class KlapController {
    constructor(
        private klapService: KlapService,
        private pedidoService: PedidoService
    ) { }

    async CreateOrder(req: AuthRequest, res: Response) {
        const { referenceId, user, items, total } = req.body;

        try {
            const userId = req.usuarioId;
            if (!userId) throw new Error("Usuario no identificado");

            const order = await this.klapService.createOrder(referenceId, user, items, total);
            res.json(order);
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }

    async GetOrderStatus(req: AuthRequest, res: Response) {
        const { orderId } = req.params;

        try {
            const userId = req.usuarioId;
            if (!userId) throw new Error("Usuario no identificado");

            if (!orderId || typeof orderId !== 'string') {
                return res.status(400).json({ error: "orderId es requerido y debe ser un string" });
            }

            const response = await this.klapService.getOrderStatus(orderId);
            res.json(response);
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }

    async RefundOrder(req: AuthRequest, res: Response) {
        const { orderId } = req.params;
        const { referenceId, amount } = req.body;

        try {
            const userId = req.usuarioId;
            const userRol = req.rol;

            if (!userId) throw new Error("Usuario no identificado");

            if (!orderId || typeof orderId !== 'string') {
                return res.status(400).json({ error: "orderId es requerido y debe ser un string" });
            }
            if (!referenceId || typeof referenceId !== 'string') {
                return res.status(400).json({ error: "referenceId es requerido y debe ser un string" });
            }
            if (!amount || typeof amount !== 'number') {
                return res.status(400).json({ error: "amount es requerido y debe ser un número" });
            }

            const pedido = await this.pedidoService.findByKlapId(orderId);
            if (!pedido) throw new Error("Pedido no encontrado");

            if (pedido.estado === EstadoPedido.Entregado)
                throw new Error("El pedido ya ha sido entregado y no puede ser cancelado.");

            if (userRol === 'cliente') {
                if (pedido.usuario_id !== userId || pedido.estado !== EstadoPedido.Pendiente)
                    throw new Error("Error realizando reembolso en Klap");
            }

            const refund = await this.klapService.refundOrder(orderId, referenceId, amount);
            res.json(refund);
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }

}

