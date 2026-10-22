import { Request, Response } from 'express';
import { StarkenService } from '../services/starken.service';

export class StarkenController {
    constructor(private starkenService: StarkenService) { }

    async getTrackingStatus(req: Request, res: Response) {
        const { freightOrder } = req.params;

        try {
            if (!freightOrder || isNaN(Number(freightOrder))) {
                return res.status(400).json({ error: 'El parámetro freightOrder es requerido y debe ser numérico.' });
            }

            const trackingData = await this.starkenService.getSingleTracking(Number(freightOrder));
            return res.json(trackingData);
        } catch (err: any) {
            console.error('Error en getTrackingStatus:', err);
            return res.status(500).json({ error: err.message });
        }
    }
}