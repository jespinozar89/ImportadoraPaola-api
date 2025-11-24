import { Router } from "express";
import { pedidoController } from "../config/container";
import { authenticateToken, authorizeRole } from "../middlewares/auth.middleware";
import { Rol } from "@prisma/client";

const router = Router();

// TODAS las rutas de pedidos requieren estar logueado
router.use(authenticateToken);

/**
 * @openapi
 * /api/pedidos:
 *   post:
 *     summary: Crear un nuevo pedido
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     producto_id:
 *                       type: integer
 *                     cantidad:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Pedido creado exitosamente
 *       400:
 *         description: Error de validación
 */
router.post("/", pedidoController.create.bind(pedidoController));

/**
 * @openapi
 * /api/pedidos/mis-pedidos:
 *   get:
 *     summary: Obtener mis pedidos
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos del usuario autenticado
 */
router.get("/mis-pedidos", pedidoController.findMyOrders.bind(pedidoController));

/**
 * @openapi
 * /api/pedidos/{id}:
 *   get:
 *     summary: Obtener un pedido por ID
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido no encontrado
 */
router.get("/:id", pedidoController.findById.bind(pedidoController));

/**
 * @openapi
 * /api/pedidos:
 *   get:
 *     summary: Obtener todos los pedidos (solo administrador)
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todos los pedidos
 *       403:
 *         description: No autorizado
 */
router.get(
    "/", 
    authorizeRole([Rol.administrador]), 
    pedidoController.findAll.bind(pedidoController)
);

export default router;