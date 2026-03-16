import { klapController } from "../config/container";
import { Router } from "express";

const router = Router();

/**
 * @openapi
 * /api/klap/pay:
 *   post:
 *     summary: Crear una nueva orden de pago en Klap
 *     tags:
 *       - Klap
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
 *               user:
 *                 type: object
 *                 description: Datos del usuario que realiza el pago
 *                 properties:
 *                   email:
 *                     type: string
 *                     example: example@multicaja.cl
 *                   rut:
 *                     type: string
 *                     example: "111111111"
 *                   first_name:
 *                     type: string
 *                     example: Pedro
 *                   last_name:
 *                     type: string
 *                     example: Perez
 *                   phone:
 *                     type: string
 *                     example: "912345678"
 *                   address_line:
 *                     type: string
 *                     example: Bandera 1234
 *                   address_city:
 *                     type: string
 *                     example: Santiago
 *                   address_state:
 *                     type: string
 *                     example: RM
 *                   country:
 *                     type: string
 *                     example: CL
 *                   postal_code:
 *                     type: string
 *                     example: "8320000"
 *               items:
 *                 type: array
 *                 description: Lista de productos o servicios a adquirir
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Producto A
 *                     code:
 *                       type: string
 *                       example: A001
 *                     price:
 *                       type: number
 *                       example: 39000
 *                     unit_price:
 *                       type: number
 *                       example: 13000
 *                     quantity:
 *                       type: integer
 *                       example: 3
 *               total:
 *                 type: number
 *                 description: Monto total de la orden
 *                 example: 41000
 *     responses:
 *       200:
 *         description: Orden creada exitosamente en Klap
 *       400:
 *         description: Error de validación de parámetros
 *       401:
 *         description: API Key inválida o no autorizada
 *       500:
 *         description: Error interno al crear la orden
 */
router.post("/pay", klapController.CreateOrder.bind(klapController));

/**
 * @openapi
 * /api/klap/status/{orderId}:
 *   get:
 *     summary: Consultar estado de una orden en Klap
 *     tags:
 *       - Klap
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador único de la orden en Klap
 *         example: 1M87674e8c41354afe9970d017f0f820f6
 *     responses:
 *       200:
 *         description: Estado de la orden consultado exitosamente
 *       400:
 *         description: Error de validación de parámetros
 *       401:
 *         description: API Key inválida o no autorizada
 *       404:
 *         description: Orden no encontrada en Klap
 *       500:
 *         description: Error interno al consultar el estado de la orden
 */
router.get("/status/:orderId", klapController.GetOrderStatus.bind(klapController));

export default router;
