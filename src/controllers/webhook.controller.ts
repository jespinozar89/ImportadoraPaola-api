import { WebhookService } from "../services/webhook.service";
import { Request, Response } from "express";

export class WebhookController {

    constructor(private webhookService: WebhookService) { }


    async validation(req: Request, res: Response) {
        await this.webhookService.validation(req.body);
        res.status(200).send("OK");
    }

    
    async confirm(req: Request, res: Response) {
        await this.webhookService.confirm(req.body);
        res.status(200).send("OK");
    }

   
    async reject(req: Request, res: Response) {
        await this.webhookService.reject(req.body);
        res.status(200).send("OK");
    }
}


