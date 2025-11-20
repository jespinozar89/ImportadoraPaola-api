import { Router } from "express";
import { authController } from "../config/container"; // Importamos la instancia lista

const router = Router();

// Usamos .bind para asegurar que 'this' dentro del controller siga apuntando a la clase
router.post("/register", authController.register.bind(authController));
router.post("/login", authController.login.bind(authController));

export default router;