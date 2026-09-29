import { Router } from 'express';
import { TarifaController } from '../controllers/tarifa.controller';


const router = Router();
const tarifaController = new TarifaController();

/**
 * @openapi
 * /api/tarifas:
 *   get:
 *     summary: Obtener todas las tarifas de envío
 *     tags:
 *       - Tarifas
 *     responses:
 *       200:
 *         description: Lista de tarifas obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   region:
 *                     type: string
 *                     example: "Valparaíso"
 *                   comuna:
 *                     type: string
 *                     example: "Limache"
 *                   precio:
 *                     type: number
 *                     example: 3500
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/', tarifaController.obtenerTodasLasTarifas);

/**
 * @openapi
 * /api/tarifas/cotizar:
 *   post:
 *     summary: Cotizar costo de envío
 *     tags:
 *       - Tarifas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - region
 *               - comuna
 *             properties:
 *               region:
 *                 type: string
 *                 example: "Valparaíso"
 *               comuna:
 *                 type: string
 *                 example: "Viña del Mar"
 *               subtotal:
 *                 type: number
 *                 description: Subtotal de la compra para validar si aplica envío gratis o descuento
 *                 example: 25000
 *     responses:
 *       200:
 *         description: Cotización calculada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 costo_envio:
 *                   type: number
 *                   example: 2990
 *                 aplica_despacho:
 *                   type: boolean
 *                   example: true
 *                 mensaje:
 *                   type: string
 *                   example: "Cotización realizada con éxito"
 *       400:
 *         description: Parámetros requeridos faltantes o inválidos.
 *       404:
 *         description: No se encontró cobertura para la comuna ingresada.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/cotizar', tarifaController.cotizarEnvio);

export default router;