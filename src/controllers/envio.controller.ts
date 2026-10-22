import { Request, Response } from 'express';
import { EnvioService } from '@/services/envio.service';

export class EnvioController {
  constructor(private envioService: EnvioService) {}

  async getByOrderId(req: Request, res: Response) {
    const { orderId } = req.params;

    try {
      if (!orderId || isNaN(Number(orderId))) {
        return res.status(400).json({ error: 'El ID del pedido es obligatorio y debe ser numérico.' });
      }

      const shipment = await this.envioService.getShipmentByOrderId(Number(orderId));
      return res.json(shipment);
    } catch (err: any) {
      return res.status(404).json({ error: err.message });
    }
  }

  async getByFreightNumber(req: Request, res: Response) {
    const { freightNumber } = req.params;

    try {
      if (!freightNumber) {
        return res.status(400).json({ error: 'El número de flete es obligatorio.' });
      }

      const shipment = await this.envioService.getShipmentByFreightNumber(String(freightNumber));
      return res.json(shipment);
    } catch (err: any) {
      return res.status(404).json({ error: err.message });
    }
  }

  async createShipment(req: Request, res: Response) {
    try {
      const newShipment = await this.envioService.createShipment(req.body);
      return res.status(201).json(newShipment);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async updateShipmentStatus(req: Request, res: Response) {
    const { freightNumber } = req.params;

    try {
      if (!freightNumber) {
        return res.status(400).json({ error: 'Freight number is required.' });
      }

      const updatedShipment = await this.envioService.updateShipmentStatus(
        String(freightNumber),
        req.body
      );
      return res.json(updatedShipment);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}