import { Request, Response } from 'express';
import { StarkenWebhookService } from '../services/starkenWebhook.service';

export class StarkenWebhookController {
  constructor(private starkenWebhookService: StarkenWebhookService) {}

  async handleWebhook(req: Request, res: Response) {
    try {
      const payload = req.body;

      await this.starkenWebhookService.processWebhookEvent(payload);

      return res.status(200).json({ mensaje: 'OK' });
    } catch (err: any) {
      console.error('[Starken Webhook Error]:', err.message);
      return res.status(200).json({ mensaje: 'OK', error: err.message });
    }
  }
}