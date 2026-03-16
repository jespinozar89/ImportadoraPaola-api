import { Router } from "express";
import { webhookController } from "../config/container";
import { validateApikey } from "../middlewares/klap.middlewares";

const router = Router();

/**
* @openapi
* /api/webhooks/validation:
*   post:
*     summary: Webhook de validación de orden
*     description: Endpoint que recibe la notificación de validación de Klap al momento de crear una orden.
*     tags:
*       - Webhooks
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - referenceId
*               - user
*               - items
*               - total
*             properties:
*               referenceId:
*                 type: string
*                 description: Identificador único de la orden en el comercio
*                 example: REF-TEST-001
*               orderId:
*                 type: string
*                 description: Identificador único de la orden de compra
*                 example: ORD-123456789
*     responses:
*       200:
*         description: Validación recibida correctamente
*       400:
*         description: Error en la validación
*/
router.post("/validation", webhookController.validation.bind(webhookController));

/**
 * @openapi
 * /api/webhooks/confirm:
 *   post:
 *     summary: Webhook de confirmación de pago
 *     description: Endpoint que recibe la notificación de Klap cuando un pago se ha realizado exitosamente.
 *     tags:
 *       - Webhooks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - referenceId
 *               - user
 *               - items
 *               - total
 *             properties:
 *               referenceId:
 *                 type: string
 *                 description: Identificador único de la orden en el comercio
 *                 example: REF-TEST-001
 *               orderId:
 *                 type: string
 *                 description: Identificador único de la orden de compra
 *                 example: ORD-123456789
 *     responses:
 *       200:
 *         description: Confirmación recibida correctamente
 *       400:
 *         description: Error en la confirmación
 */
router.post("/confirm",validateApikey, webhookController.confirm.bind(webhookController));

/**
* @openapi
* /api/webhooks/reject:
*   post:
*     summary: Webhook de rechazo de pago
*     description: Endpoint que recibe la notificación de Klap cuando una orden ha fallado en el proceso de pago.
*     tags:
*       - Webhooks
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - referenceId
*               - user
*               - items
*               - total
*             properties:
*               referenceId:
*                 type: string
*                 description: Identificador único de la orden en el comercio
*                 example: REF-TEST-001
*               orderId:
*                 type: string
*                 description: Identificador único de la orden de compra
*                 example: ORD-123456789
*     responses:
*       200:
*         description: Rechazo recibido correctamente
*       400:
*         description: Error en el rechazo
*/
router.post("/reject",validateApikey, webhookController.reject.bind(webhookController));

export default router;

