import { Router } from "express";
import { favoritoController } from "../config/container";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticateToken);

/**
 * @openapi
 * /api/favoritos:
 *   post:
 *     summary: Agregar un producto a mis favoritos
 *     tags:
 *       - Favoritos
 *     description: Requiere cookie de autenticación. No permite duplicados.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - producto_id
 *             properties:
 *               producto_id:
 *                 type: integer
 *                 description: ID del producto a añadir a favoritos
 *                 example: 10
 *     responses:
 *       '201':
 *         description: Producto agregado a favoritos exitosamente
 *       '400':
 *         description: El producto ya está en favoritos o el ID de producto no existe
 *       '401':
 *         description: No autorizado (Falta token)
 */
router.post("/", favoritoController.add.bind(favoritoController));


/**
 * @openapi
 * /api/favoritos:
 *   get:
 *     summary: Listar todos mis productos favoritos
 *     tags:
 *       - Favoritos
 *     description: Devuelve la lista de favoritos del usuario autenticado, incluyendo los detalles del producto.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Lista obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   favorito_id:
 *                     type: integer
 *                     example: 1
 *                   usuario_id:
 *                     type: integer
 *                     example: 5
 *                   producto_id:
 *                     type: integer
 *                     example: 10
 *                   fecha_agregado:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-11-26T14:45:00Z"
 *                   producto:
 *                     type: object
 *                     description: Datos del producto asociado
 *                     properties:
 *                       nombre:
 *                         type: string
 *                         example: "Mouse inalámbrico"
 *                       precio:
 *                         type: number
 *                         example: 19990
 *       '401':
 *         description: No autorizado
 */
router.get("/", favoritoController.getAll.bind(favoritoController));

/**
 * @openapi
 * /api/favoritos/{productoId}:
 *   delete:
 *     summary: Eliminar un producto de favoritos
 *     tags:
 *       - Favoritos
 *     description: Elimina un producto de la lista de favoritos del usuario autenticado. Se debe enviar el ID del producto por URL.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: productoId
 *         in: path
 *         required: true
 *         description: ID del producto a remover
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Producto eliminado de favoritos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Producto eliminado de favoritos
 *       '404':
 *         description: El producto no estaba en la lista de favoritos
 *       '401':
 *         description: No autorizado
 */
router.delete("/:productoId", favoritoController.remove.bind(favoritoController));

export default router;
