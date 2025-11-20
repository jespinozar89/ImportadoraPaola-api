import { Router } from "express";
import { categoriaController } from "../config/container"; 
// Importamos el middleware (usando la extensión .js)
import { authenticateToken, authorizeRole } from "../middlewares/auth.middleware";
import { Rol } from "@prisma/client";

const router = Router();

// RUTAS PÚBLICAS (Lectura)
router.get("/", categoriaController.findAll.bind(categoriaController));
router.get("/:id", categoriaController.findById.bind(categoriaController));

// RUTAS PROTEGIDAS (Modificación)
// Requieren Token JWT y Rol de Administrador
router.post(
    "/", 
    authenticateToken, 
    authorizeRole([Rol.administrador]), 
    categoriaController.create.bind(categoriaController)
);
router.put(
    "/:id", 
    authenticateToken, 
    authorizeRole([Rol.administrador]), 
    categoriaController.update.bind(categoriaController)
);
router.delete(
    "/:id", 
    authenticateToken, 
    authorizeRole([Rol.administrador]), 
    categoriaController.delete.bind(categoriaController)
);

export default router;