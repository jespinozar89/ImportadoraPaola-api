// src/routes/productos.routes.ts

import { Router } from "express";
import { productoController } from "../config/container"; 
import { authenticateToken, authorizeRole } from "../middlewares/auth.middleware";
import { Rol } from "@prisma/client";

const router = Router();

// RUTAS PÚBLICAS (Lectura)
router.get("/", productoController.findAll.bind(productoController));
router.get("/:id", productoController.findById.bind(productoController));

// RUTAS PROTEGIDAS (Modificación - Solo Administrador)
router.post(
    "/", 
    authenticateToken, 
    authorizeRole([Rol.administrador]), 
    productoController.create.bind(productoController)
);
router.put(
    "/:id", 
    authenticateToken, 
    authorizeRole([Rol.administrador]), 
    productoController.update.bind(productoController)
);
router.delete(
    "/:id", 
    authenticateToken, 
    authorizeRole([Rol.administrador]), 
    productoController.delete.bind(productoController)
);

export default router;