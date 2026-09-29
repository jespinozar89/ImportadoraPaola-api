import { Router } from 'express';
import { UbicacionesController } from '../controllers/ubicaciones.controller';

const router = Router();
const controller = new UbicacionesController();

/**
 * @openapi
 * /api/ubicaciones:
 *   get:
 *     summary: Obtener el listado completo de regiones y comunas
 *     tags:
 *       - Ubicaciones
 *     responses:
 *       200:
 *         description: Arreglo completo con la estructura jerárquica de regiones y sus comunas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   codigo:
 *                     type: string
 *                     example: "05"
 *                   nombre:
 *                     type: string
 *                     example: "Valparaíso"
 *                   comunas:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         codigo:
 *                           type: string
 *                           example: "05101"
 *                         nombre:
 *                           type: string
 *                           example: "Valparaíso"
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/', controller.obtenerTodo);

/**
 * @openapi
 * /api/ubicaciones/regiones:
 *   get:
 *     summary: Obtener el listado de todas las regiones
 *     tags:
 *       - Ubicaciones
 *     responses:
 *       200:
 *         description: Lista de regiones obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   codigo:
 *                     type: string
 *                     example: "05"
 *                   nombre:
 *                     type: string
 *                     example: "Valparaíso"
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/regiones', controller.obtenerRegiones);

/**
 * @openapi
 * /api/ubicaciones/regiones/{codigo}/comunas:
 *   get:
 *     summary: Obtener las comunas asociadas a una región específica
 *     tags:
 *       - Ubicaciones
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *         description: Código o identificador de la región (ej. "05" para Valparaíso)
 *         example: "05"
 *     responses:
 *       200:
 *         description: Lista de comunas de la región solicitada.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   codigo:
 *                     type: string
 *                     example: "05101"
 *                   nombre:
 *                     type: string
 *                     example: "Valparaíso"
 *       404:
 *         description: No se encontró la región especificada.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/regiones/:codigo/comunas', controller.obtenerComunasPorRegion);

export default router;