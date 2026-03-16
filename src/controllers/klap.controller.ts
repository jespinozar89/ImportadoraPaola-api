import { Request, Response } from "express";
import { KlapService } from "../services/klap.service";

export class KlapController {
    constructor(private klapService: KlapService) { }

    async CreateOrder(req: Request, res: Response) {
        const { referenceId, user, items, total } = req.body;

        try {
            const order = await this.klapService.createOrder(referenceId, user, items, total);
            res.json(order);
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }

    async GetOrderStatus(req: Request, res: Response) {
        const { orderId } = req.params;

        if (!orderId || typeof orderId !== 'string') {
            return res.status(400).json({ error: "orderId es requerido y debe ser un string" });
        }

        try {
            const status = await this.klapService.getOrderStatus(orderId);
            res.json(status);
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }

}

