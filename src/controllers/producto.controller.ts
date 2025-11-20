import { Request, Response } from 'express';
import { ProductoService } from '../services/producto.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { RequestHelpers } from '../utils/request-helpers';

export class ProductoController {
    constructor(private productoService: ProductoService) { }

    async create(req: AuthRequest, res: Response) {
        try {
            const producto = await this.productoService.create(req.body);
            // El producto creado incluye la cadena Base64, pero el cliente la necesita.
            res.status(201).json(producto);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async findAll(req: Request, res: Response) {
        try {
            const productos = await this.productoService.findAll();
            // NOTA: Esta respuesta contendrá la(s) cadena(s) Base64 completa(s),
            // lo cual puede hacer que la respuesta sea LENTA y GRANDE.
            res.status(200).json(productos);
        } catch (error: any) {
            res.status(500).json({ message: 'Error al obtener productos', error: error.message });
        }
    }

    async findById(req: Request, res: Response) {
        try {
            const id = RequestHelpers.getIdParam(req, res);
            if (id === null) return;

            const producto = await this.productoService.findById(id);
            res.status(200).json(producto);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = RequestHelpers.getIdParam(req, res);
            if (id === null) return;

            const producto = await this.productoService.update(id, req.body);
            res.status(200).json(producto);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = RequestHelpers.getIdParam(req, res);
            if (id === null) return;

            await this.productoService.delete(id);
            res.status(200).json({ message: 'Producto eliminado exitosamente' });
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

}