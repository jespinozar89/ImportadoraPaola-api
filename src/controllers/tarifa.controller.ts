import { Request, Response } from 'express';
import { Tarifa } from '@/dtos/tarifa.dto';

const tarifasData = require('../data/tarifas.json');

export class TarifaController {

    public obtenerTodasLasTarifas = (req: Request, res: Response): void => {
        try {
            res.status(200).json(tarifasData);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener las tarifas' });
        }
    };

    public cotizarEnvio = (req: Request, res: Response): void => {
        try {
            const { region, comuna, subtotal, codigoRegion } = req.body;

            if (!region || !comuna || subtotal === undefined) {
                res.status(400).json({ mensaje: 'Faltan parámetros requeridos (region, comuna, subtotal)' });
                return;
            }

            if (typeof subtotal !== 'number' || subtotal < 0) {
                res.status(400).json({ mensaje: 'El subtotal debe ser un número válido mayor o igual a 0' });
                return;
            }

            const tarifas: Tarifa[] = tarifasData as Tarifa[];

            let tarifa = tarifas.find(
                (t) => t.comuna && t.comuna.toLowerCase() === comuna.trim().toLowerCase()
            );

            if (!tarifa) {
                tarifa = tarifas.find(
                    (t) => t.comuna === null && (
                        (codigoRegion && t.codigo === codigoRegion) ||
                        t.region.toLowerCase() === region.trim().toLowerCase()
                    )
                );
            }

            if (!tarifa) {
                tarifa = tarifas.find((t) => t.region === 'General' && t.comuna === null);
            }

            if (!tarifa) {
                res.status(404).json({ mensaje: 'No se encontró una tarifa de envío aplicable' });
                return;
            }

            res.status(200).json({
                costoEnvio: tarifa.costo,
                diasEntrega: tarifa.dias_entrega
            });

        } catch (error) {
            res.status(500).json({ mensaje: 'Error al cotizar el envío' });
        }
    };
}