import { CorreoService } from "@/services/correo.service";
import { WebhookService } from "../services/webhook.service";
import { Request, Response } from "express";

export class WebhookController {

    constructor(
        private webhookService: WebhookService,
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

            const emailUsuario = order.email_contacto || order.user?.email || (order as any).usuario?.email;
            const nombreUsuario = order.nombre_contacto || order.user?.nombres || (order as any).usuario?.nombres;

            await this.correoService.enviarConfirmacionPedido(
                emailUsuario,
                {
                    id_pedido: order.pedido_id,
                    usuario_nombre: nombreUsuario,
                    productos: order.detalles,
                    total: Number(order.total)
                }
            );

            return res.status(200).send('OK');
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async reject(req: Request, res: Response) {
        res.status(200).send("OK");
    }
}


