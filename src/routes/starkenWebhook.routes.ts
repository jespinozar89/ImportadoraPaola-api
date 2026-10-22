import { Router } from 'express';
import { starkenWebhookController } from '../config/container';

const router = Router();

/**
 * @openapi
 * /api/webhooks/starken:
 *   post:
 *     summary: Endpoint receptor del Webhook Acuso de Estado de Starken
 *     tags:
 *       - Webhooks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - numeroOrdenFlete
 *             properties:
 *               numeroOrdenFlete:
 *                 type: integer
 *                 example: 253268084
 *               nombreEstadoHomologado:
 *                 type: string
 *                 example: "ENTREGADO"
 *               descripcionEstado:
 *                 type: string
 *                 example: "ENTREGADO"
 *               nombreRecibe:
 *                 type: string
 *                 example: "ROLANDO DE PABLO U"
 *               rutRecibe:
 *                 type: integer
 *                 example: 5548924
 *               dvRecibe:
 *                 type: string
 *                 example: "6"
 *               urlImagen:
 *                 type: string
 *                 example: "https://restservices.starken.cl/apiprd/starkenservices/rest/ImageListener?codigoOrdenFlete=253268084"
 *     responses:
 *       200:
 *         description: Notificación procesada correctamente
 *         content:
 *           application/json:
 *             example:
 *               mensaje: "OK"
 */
router.post(
  '/starken',
  starkenWebhookController.handleWebhook.bind(starkenWebhookController)
);

export default router;