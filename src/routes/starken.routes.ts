import { Router } from 'express';
import { starkenController } from '../config/container';

const router = Router();

/**
 * @openapi
 * /api/starken/tracking/{freightOrder}:
 *   post:
 *     summary: Consultar seguimiento unitario de una orden de flete en Starken
 *     tags:
 *       - Starken
 *     parameters:
 *       - in: path
 *         name: freightOrder
 *         required: true
 *         schema:
 *           type: integer
 *         description: Número de orden de flete (tracking) de Starken
 *         example: 222582291
 *     responses:
 *       200:
 *         description: Detalle del seguimiento obtenido exitosamente desde Starken
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cantidadBultos:
 *                   type: integer
 *                   example: 1
 *                 cantidadKilos:
 *                   type: number
 *                   example: 1.0
 *                 ciudadDestino:
 *                   type: string
 *                   example: "SANTIAGO"
 *                 ciudadOrigen:
 *                   type: string
 *                   example: "SANTIAGO"
 *                 codigoAgenciaDestino:
 *                   type: integer
 *                   example: 1467
 *                 codigoEstadoHomologado:
 *                   type: integer
 *                   example: 8
 *                 cuentaCorriente:
 *                   type: integer
 *                   example: 42374
 *                 descEstadoHomologado:
 *                   type: string
 *                   example: "Contáctanos a través de nuestros canales para verificar el estado de tu envío"
 *                 descripcionAgenciaDestino:
 *                   type: string
 *                   example: "CENTRO DISTRIBUCION S.BERNARDO"
 *                 direccionAgenciaDestino:
 *                   type: string
 *                   example: "Avda.Gral.Velasquez 11759"
 *                 documentoCliente:
 *                   type: integer
 *                   example: 0
 *                 estadoFlete:
 *                   type: string
 *                   example: "ENTREGADO"
 *                 estadoHomologado:
 *                   type: string
 *                   example: "ENTREGADO"
 *                 fechaCompromiso:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-10T00:00:00-03:00"
 *                 fechaEmision:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-08T00:24:11-03:00"
 *                 fechaEntrega:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-11T03:08:00-03:00"
 *                 nombreDestinatario:
 *                   type: string
 *                   example: "JUAN PEREZ"
 *                 nombreRemitente:
 *                   type: string
 *                   example: "LIBRERIA PAOLA"
 *                 nombreRetira:
 *                   type: string
 *                   example: "JUAN PEREZ"
 *                 ordenFlete:
 *                   type: integer
 *                   example: 222399414
 *                 rutRetira:
 *                   type: string
 *                   example: "12345678-9"
 *                 tipoEntrega:
 *                   type: string
 *                   example: "DOMICILIO"
 *                 tipoServicio:
 *                   type: string
 *                   example: "NORMAL"
 *                 valorFlete:
 *                   type: number
 *                   example: 2320.0
 *       400:
 *         description: El parámetro freightOrder es requerido y debe ser numérico
 *       500:
 *         description: Error interno o de comunicación con el servicio de Starken
 */
router.post(
  '/tracking/:freightOrder', 
  starkenController.getTrackingStatus.bind(starkenController)
);

export default router;