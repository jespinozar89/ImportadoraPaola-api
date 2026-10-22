import { CorreoService } from "@/services/correo.service";
import { KlapWebhookService } from "../services/klapWebhook.service";
import { Request, Response } from "express";

export class KlapWebhookController {

    constructor(
        private webhookService: KlapWebhookService,
        private correoService: CorreoService
    ) { }


    async validation(req: Request, res: Response) {
        try {
            const { items } = req.body;

            const isValid = await this.webhookService.validateStock(items);

            if (!isValid) {
                return res.status(400).json({ message: 'Stock insuficiente o productos no válidos.' });
            }

            return res.status(200).send('OK');
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async confirm(req: Request, res: Response) {
        try {
            const { reference_id, order_id } = req.body;

            const pedido = await this.webhookService.findByKlapId(reference_id);

            if (!pedido) {
                return res.status(404).json({ message: 'Pedido no encontrado.' });
            }

            await this.webhookService.confirmOrderAndDeductStock(pedido.detalles);
            const order = await this.webhookService.updateKlapOrderId(reference_id, order_id);

            const emailUsuario = order.email_contacto || (order as any).usuario?.email;
            const nombreUsuario = order.nombre_contacto || (order as any).usuario?.nombres;

            const productosMapeados = order.detalles.map((detalle: any) => ({
                nombre: detalle.nombre || detalle.producto?.nombre || 'Producto',
                cantidad: detalle.cantidad,
                precio_unitario: Number(detalle.precio_unitario ?? 0),
                precio_unitario_oferta: detalle.precio_unitario_oferta
                    ? Number(detalle.precio_unitario_oferta)
                    : null
            }));

            await this.correoService.enviarConfirmacionPedido(
                emailUsuario,
                {
                    id_pedido: order.pedido_id,
                    usuario_nombre: nombreUsuario,
                    tipo_entrega: order.tipo_entrega,
                    subtotal: Number(order.subtotal ?? 0),
                    costo_envio: Number(order.costo_envio ?? 0),
                    total: Number(order.total ?? 0),
                    direccion_envio: order.direccion_envio,
                    productos: productosMapeados
                }
            );

            return res.status(200).send('OK');
        } catch (error: any) {
            console.error('Error en el webhook confirm:', error);
            return res.status(500).json({ message: error.message });
        }
    }

    async reject(req: Request, res: Response) {
        res.status(200).send("OK");
    }
}


