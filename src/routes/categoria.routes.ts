import { Router } from "express";
import { categoriaController } from "../config/container"; 
// Importamos el middleware (usando la extensión .js)
import { authenticateToken, authorizeRole } from "../middlewares/auth.middleware";
import { Rol } from "@prisma/client";

const router = Router();

// RUTAS PÚBLICAS (Lectura)
/**
 * @openapi
 * /api/categorias:
 *   get:
 *     summary: Obtener todas las categorías
 *     tags:
 *       - Categorías
 *     responses:
 *       200:
 *         description: Lista de categorías
 */
router.get("/", categoriaController.findAll.bind(categoriaController));
/**
 * @openapi
 * /api/categorias/{id}:
 *   get:
 *     summary: Obtener una categoría por ID
 *     tags:
 *       - Categorías
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *       404:
 *         description: Categoría no encontrada
 */
router.get("/:id", categoriaController.findById.bind(categoriaController));

// RUTAS PROTEGIDAS (Modificación)
// Requieren Token JWT y Rol de Administrador
/**
 * @openapi
 * /api/categorias:
 *   post:
 *     summary: Crear una nueva categoría
 *     tags:
 *       - Categorías
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                type: string
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente
 *       400:
 *         description: Error de validación
 *       403:
 *         description: No autorizado
 */
router.post(
    "/", 
    authenticateToken, 
    authorizeRole([Rol.administrador]), 
    categoriaController.create.bind(categoriaController)
);

/**
 * @openapi
 * /api/categorias/{id}:
 *   put:
 *     summary: Actualizar una categoría
 *     tags:
 *       - Categorías
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Categoría actualizada
 *       400:
 *         description: Error de validación
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Categoría no encontrada
 */
router.put(
    "/:id", 
    authenticateToken, 
    authorizeRole([Rol.administrador]), 
    categoriaController.update.bind(categoriaController)
);
/**
 * @openapi
 * /api/categorias/{id}:
 *   delete:
 *     summary: Eliminar una categoría
 *     tags:
 *       - Categorías
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoría eliminada
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Categoría no encontrada
 */
router.delete(
    "/:id", 
    authenticateToken, 
    authorizeRole([Rol.administrador]), 
    categoriaController.delete.bind(categoriaController)
);

export default router;