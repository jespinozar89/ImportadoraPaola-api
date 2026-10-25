import { envioController } from '../config/container';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /api/envios/order/{orderId}:
 *   get:
 *     summary: Obtener el detalle del envío e historial por ID de pedido
 *     tags:
 *       - Envíos
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pedido
 *         example: 105
 *     responses:
 *       200:
 *         description: Información del envío e historial obtenida exitosamente.
 *       400:
 *         description: El ID de pedido es inválido.
 *       404:
 *         description: Envío no encontrado para el pedido especificado.
 */
router.get(
  '/order/:orderId',
  envioController.getByOrderId.bind(envioController)
);

/**
 * @openapi
 * /api/envios/freight/{freightNumber}:
 *   get:
 *     summary: Obtener detalle del envío e historial por número de orden de flete
 *     tags:
 *       - Envíos
 *     parameters:
 *       - in: path
 *         name: freightNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Número de orden de flete asignado por Starken
 *         example: "222582291"
 *     responses:
 *       200:
 *         description: Información del envío e historial obtenida exitosamente.
 *       400:
 *         description: El número de flete es requerido.
 *       404:
 *         description: Envío no encontrado.
 */
router.get(
  '/freight/:freightNumber',
  envioController.getByFreightNumber.bind(envioController)
);

/**
 * @openapi
 * /api/envios:
 *   post:
 *     summary: Crear un nuevo registro de envío
 *     tags:
 *       - Envíos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pedido_id
 *               - empresa
 *               - numero_flete
 *             properties:
 *               pedido_id:
 *                 type: integer
 *                 example: 105
 *               empresa:
 *                 type: string
 *                 example: "Starken"
 *               numero_flete:
 *                 type: string
 *                 example: "222582291"
 *               estado:
 *                 type: string
 *                 example: "PENDIENTE"
 *     responses:
 *       201:
 *         description: Envío creado exitosamente.
 *       400:
 *         description: Datos requeridos faltantes o envío duplicado.
 */
router.post(
  '/',
  envioController.createShipment.bind(envioController)
);

/**
 * @openapi
 * /api/envios/freight/{freightNumber}/status:
 *   patch:
 *     summary: Actualizar datos de envío e insertar evento en historial
 *     tags:
 *       - Envíos
 *     parameters:
 *       - in: path
 *         name: freightNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Número de orden de flete
 *         example: "222582291"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *                 example: "EN_TRANSITO_A_DESTINO"
 *               numero_flete:
 *                 type: string
 *                 example: "222582292"
 *               descripcion_estado:
 *                 type: string
 *                 example: "Paquete en ruta a la sucursal de destino"
 *     responses:
 *       200:
 *         description: Datos del envío actualizados correctamente.
 *       400:
 *         description: Error de validación o envío no encontrado.
 */
router.patch(
  '/freight/:freightNumber/status',
  envioController.updateShipmentStatus.bind(envioController)
);

export default router;