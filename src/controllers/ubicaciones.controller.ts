import { Request, Response } from 'express';
import { RegionComuna } from '@/dtos/regionesComuna.dto';

const ubicacionesData = require('../data/regiones-comunas.json');

export class UbicacionesController {

    public obtenerTodo = (req: Request, res: Response): void => {
        try {
            res.status(200).json(ubicacionesData);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener las ubicaciones' });
        }
    };

    public obtenerRegiones = (req: Request, res: Response): void => {
        try {
            const regiones = (ubicacionesData as RegionComuna[]).map(({ codigo, region }) => ({ codigo, region }));
            res.status(200).json(regiones);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener las regiones' });
        }
    };

    public obtenerComunasPorRegion = (req: Request, res: Response): void => {
        try {
            const { codigo } = req.params;
            const regionEncontrada = (ubicacionesData as RegionComuna[]).find(u => u.codigo === codigo);

            if (!regionEncontrada) {
                res.status(404).json({ mensaje: 'Región no encontrada' });
                return;
            }

            res.status(200).json(regionEncontrada.comunas);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener las comunas' });
        }
    };
}