import { Router } from "express";
import { carritoController } from "../config/container";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

// Todas las rutas requieren estar logueado
router.use(authenticateToken);

/**
 * @openapi
 * /api/carrito:
 *   post:
 *     summary: Añadir producto al carrito o actualizar cantidad
 *     tags:
 *       - Carrito
 *     description: Si el producto ya existe, suma la cantidad; si no, lo agrega.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - producto_id
 *               - cantidad
 *             properties:
 *               producto_id:
 *                 type: integer
 *                 description: ID del producto a añadir.
 *                 example: 5
 *               cantidad:
 *                 type: integer
 *                 description: Cantidad del producto.
 *                 example: 1
 *     responses:
 *       '201':
 *         description: Producto agregado/cantidad actualizada.
 *       '400':
 *         description: Error de stock o producto no encontrado.
 *       '401':
 *         description: No autorizado.
 */
router.post("/", carritoController.addItem.bind(carritoController));

/**
 * @openapi
 * /api/carrito:
 *   get:
 *     summary: Obtener contenido del carrito
 *     tags:
 *       - Carrito
 *     description: Lista todos los ítems en el carrito del usuario autenticado.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Contenido del carrito.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   carrito_id:
 *                     type: integer
 *                   usuario_id:
 *                     type: integer
 *                   producto_id:
 *                     type: integer
 *                   cantidad:
 *                     type: integer
 *                   fecha_agregado:
 *                     type: string
 *                     format: date-time
 *                   producto:
 *                     type: object
 *                     description: Datos del producto asociado
 *       '401':
 *         description: No autorizado.
 */
router.get("/", carritoController.getMyCart.bind(carritoController));
/**
 * @openapi
 * /api/carrito/{carritoId}:
 *   patch:
 *     summary: Actualizar cantidad de un ítem
 *     tags:
 *       - Carrito
 *     description: Actualiza la cantidad de un ítem específico del carrito. Si la cantidad es 0 o menos, se elimina el ítem.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: carritoId
 *         in: path
 *         required: true
 *         description: ID único del ítem en la tabla Carrito.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cantidad:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Cantidad actualizada o ítem eliminado.
 *       '404':
 *         description: Ítem no encontrado o no pertenece al usuario.
 *       '401':
 *         description: No autorizado.
 */
router.patch("/:carritoId", carritoController.updateQuantity.bind(carritoController));
/**
 * @openapi
 * /api/carrito/clear:
 *   delete:
 *     summary: Vaciar todo el carrito
 *     tags:
 *       - Carrito
 *     description: Elimina todos los ítems asociados al usuario autenticado.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '204':
 *         description: Carrito vaciado exitosamente.
 *       '401':
 *         description: No autorizado.
 */
router.delete("/clear", carritoController.clearCart.bind(carritoController));
/**
 * @openapi
 * /api/carrito/{carritoId}:
 *   delete:
 *     summary: Eliminar un ítem del carrito
 *     tags:
 *       - Carrito
 *     description: Elimina completamente un ítem (fila) del carrito de compras.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: carritoId
 *         in: path
 *         required: true
 *         description: ID único del ítem en la tabla Carrito.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Ítem eliminado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ítem eliminado del carrito.
 *       '404':
 *         description: Ítem no encontrado o no pertenece al usuario.
 *       '401':
 *         description: No autorizado.
 */
router.delete("/:carritoId", carritoController.removeItem.bind(carritoController));


export default router;