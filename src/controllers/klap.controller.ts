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
            if (!user || !user.email || !user.first_name || !user.last_name) {
                return res.status(400).json({ error: "Los datos del comprador (first_name, last_name, email) son requeridos." });
            }

            let shipTo = undefined;

            const addressLine = String(user.address_line || '').trim();
            const addressCity = String(user.address_city || '').trim();
            const addressState = String(user.address_state || '').trim();
            const firstName = String(user.first_name || '').trim();
            const lastName = String(user.last_name || '').trim();
            const phone = String(user.phone || '').trim();
            const email = String(user.email || '').trim();
            const rut = user.rut ? String(user.rut).trim() : null;

            const esRetiroEnTienda = addressLine.toLowerCase().includes('retiro');

            if (addressLine && addressCity && addressState && !esRetiroEnTienda) {
                shipTo = {
                    first_name: firstName.substring(0, 60),
                    last_name: lastName.substring(0, 60),
                    phone: phone ? phone.substring(0, 15) : undefined,
                    address_line: addressLine.substring(0, 60),
                    address_city: addressCity.substring(0, 50),
                    address_state: addressState.substring(0, 20),
                    country: 'CL'
                };
            }

            const userLimpio = {
                email: email.substring(0, 200),
                rut: rut ? rut.substring(0, 15) : '',
                first_name: firstName.substring(0, 60),
                last_name: lastName.substring(0, 60),
                phone: phone.substring(0, 15)
            };

            const order = await this.klapService.createOrder(
                referenceId,
                userLimpio,
                items,
                total,
                shipTo
            );

            return res.json(order);
        } catch (err: any) {
            console.error("Error en CreateOrder Klap:", err);
            return res.status(500).json({ error: err.message });
        }
    }

    async GetOrderStatus(req: AuthRequest, res: Response) {
        const { orderId } = req.params;

        try {
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
            const userId = req.usuarioId || null;
            const userRol = req.rol;

            if (!orderId || typeof orderId !== 'string') {
                return res.status(400).json({ error: "orderId es requerido y debe ser un string" });
            }
            if (!referenceId || typeof referenceId !== 'string') {
                return res.status(400).json({ error: "referenceId es requerido y debe ser un string" });
            }
            if (!amount || typeof amount !== 'number') {
                return res.status(400).json({ error: "amount es requerido y debe ser un número" });
            }

            if (!userId || !userRol) {
                return res.status(403).json({ error: "Los usuarios invitados no pueden solicitar reembolsos directamente. Contacte a soporte." });
            }

            const pedido = await this.pedidoService.findByKlapId(orderId);
            if (!pedido) throw new Error("Pedido no encontrado");

            if (pedido.estado === EstadoPedido.Entregado) {
                throw new Error("El pedido ya ha sido entregado y no puede ser cancelado ni reembolsado.");
            }

            if (userRol === 'cliente') {
                if (pedido.usuario_id !== userId) {
                    return res.status(403).json({ error: "No tienes permiso para solicitar un reembolso de este pedido." });
                }

                if (pedido.estado !== EstadoPedido.Pendiente) {
                    return res.status(400).json({ error: "Solo se pueden reembolsar pedidos en estado Pendiente." });
                }
            } else if (userRol !== 'administrador') {
                return res.status(403).json({ error: "No tienes permisos suficientes para realizar esta acción." });
            }

            const refund = await this.klapService.refundOrder(orderId, referenceId, amount);
            res.json(refund);
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }

}

