import { Request, Response } from 'express';
import { CarritoService } from '../services/carrito.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class CarritoController {
    constructor(private carritoService: CarritoService) { }

    async addItem(req: AuthRequest, res: Response) {
        try {
            const usuarioId = req.usuarioId;
            if (!usuarioId) return res.status(401).json({ message: "Usuario no autenticado" });

            const item = await this.carritoService.addItem(usuarioId, req.body);
            res.status(201).json(item);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateQuantity(req: AuthRequest, res: Response) {
        try {
            const usuarioId = req.usuarioId;
            if (!usuarioId) return res.status(401).json({ message: "Usuario no autenticado" });

            const carritoId = this.getIdParam(req, res);
            if (carritoId === null) return;

            const updatedItem = await this.carritoService.updateItemQuantity(usuarioId, carritoId, req.body);

            res.status(200).json(updatedItem);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    async removeItem(req: AuthRequest, res: Response) {
        try {
            const usuarioId = req.usuarioId;
            if (!usuarioId) return res.status(401).json({ message: "Usuario no autenticado" });

            const carritoId = this.getIdParam(req, res);
            if (carritoId === null) return;

            await this.carritoService.removeItem(usuarioId, carritoId);

            res.status(200).json({ message: "Ítem eliminado del carrito." });
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    async clearCart(req: AuthRequest, res: Response) {
        try {
            const usuarioId = req.usuarioId;
            if (!usuarioId) return res.status(401).json({ message: "Usuario no autenticado" });

            await this.carritoService.clearCart(usuarioId);
            res.status(204).send();
        } catch (error: any) {
            if (error.message === "Carrito ya se encuentra vacío") {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    }

    async getMyCart(req: AuthRequest, res: Response) {
        try {
            const usuarioId = req.usuarioId;
            if (!usuarioId) return res.status(401).json({ message: "Usuario no autenticado" });

            const carrito = await this.carritoService.getMyCart(usuarioId);
            res.status(200).json(carrito);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getDetailedCart(req: AuthRequest, res: Response) {
        try {
            const usuarioId = req.usuarioId;
            if (!usuarioId) return res.status(401).json({ message: "Usuario no autenticado" });

            const detailedCart = await this.carritoService.getDetailedCart(usuarioId);
            res.status(200).json(detailedCart);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    private getIdParam(req: Request, res: Response): number | null {
        const idParam = req.params.carritoId;

        if (!idParam) {
            res.status(400).json({ message: 'El id es requerido' });
            return null;
        }

        const id = Number(idParam);

        if (Number.isNaN(id)) {
            res.status(400).json({ message: 'Id inválido' });
            return null;
        }

        return id;
    }


}