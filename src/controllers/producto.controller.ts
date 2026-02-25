import { Request, Response } from 'express';
import { ProductoService } from '../services/producto.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { RequestHelpers } from '../utils/request-helpers';
import { Rol } from "@prisma/client";
import 'multer';

export class ProductoController {
    constructor(private productoService: ProductoService) { }

    async create(req: AuthRequest, res: Response) {
        try {
            const producto = await this.productoService.create(req.body);
            res.status(201).json(producto);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async findAll(req: AuthRequest, res: Response) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const filtros = {
                estado: req.query.estado,
                categoria_id: req.query.categoria_id,
                search: req.query.search
            };

            if (!req.rol || req.rol !== Rol.administrador) { 
                filtros.estado = "Activo"; 
            } 

            const productos = await this.productoService.findAll(page, limit, filtros);
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

    async findByCodigo(req: Request, res: Response) {
        try {
            const { codigo } = req.params;
            if (!codigo || typeof codigo !== 'string') {
                res.status(400).json({ message: 'Código es requerido' });
                return;
            }
            const producto = await this.productoService.findByCodigo(codigo);
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

    async uploadCsv(req: Request, res: Response) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Debe subir un archivo CSV válido en el campo "file".'
                });
            }

            const { categoryId } = req.body;

            const resultado = await this.productoService.procesarCargaMasiva(req.file.buffer, Number(categoryId));

            return res.status(200).json({
                status: 'success',
                message: 'Proceso de carga masiva finalizado.',
                data: resultado
            });

        } catch (error: any) {
            console.error('Error en carga masiva:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Ocurrió un error al procesar el archivo.',
                details: error.message
            });
        }
    }

}