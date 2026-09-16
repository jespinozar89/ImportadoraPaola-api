import { Router } from "express";
import { direccionController } from "../config/container";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @openapi
 * /api/direcciones:
 *   get:
 *     summary: Obtener las direcciones del usuario autenticado
 *     tags:
 *       - Direcciones
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de direcciones del usuario
 *       401:
 *         description: Usuario no autenticado
 */
router.get("/", authenticateToken, direccionController.obtenerMisDirecciones.bind(direccionController));

/**
 * @openapi
 * /api/direcciones:
 *   post:
 *     summary: Crear una nueva dirección de envío
 *     tags:
 *       - Direcciones
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - calle
 *               - numero
 *               - comuna
 *               - region
 *             properties:
 *               calle:
 *                 type: string
 *               numero:
 *                 type: string
 *               departamento:
 *                 type: string
 *               comuna:
 *                 type: string
 *               region:
 *                 type: string
 *               es_predeterminada:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Dirección creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Usuario no autenticado
 */
router.post("/", authenticateToken, direccionController.create.bind(direccionController));

/**
 * @openapi
 * /api/direcciones/{id}:
 *   put:
 *     summary: Actualizar una dirección de envío
 *     tags:
 *       - Direcciones
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               calle:
 *                 type: string
 *               numero:
 *                 type: string
 *               departamento:
 *                 type: string
 *               comuna:
 *                 type: string
 *               region:
 *                 type: string
 *               es_predeterminada:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Dirección actualizada exitosamente
 *       400:
 *         description: Error en los datos proporcionados
 */
router.put("/:id", authenticateToken, direccionController.update.bind(direccionController));

/**
 * @openapi
 * /api/direcciones/{id}:
 *   delete:
 *     summary: Eliminar una dirección de envío
 *     tags:
 *       - Direcciones
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dirección eliminada exitosamente
 *       400:
 *         description: Error al eliminar la dirección
 */
router.delete("/:id", authenticateToken, direccionController.delete.bind(direccionController));

/**
 * @openapi
 * /api/direcciones/{id}/predeterminada:
 *   patch:
 *     summary: Establecer dirección como predeterminada
 *     tags:
 *       - Direcciones
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dirección marcada como predeterminada
 *       400:
 *         description: Error al establecer como predeterminada
 */
router.patch("/:id/predeterminada", authenticateToken, direccionController.marcarPredeterminada.bind(direccionController));

export default router;