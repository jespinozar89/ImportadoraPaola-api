import { Router } from "express";
import { productoController } from "../config/container";
import { authenticateToken, authorizeRole } from "../middlewares/auth.middleware";
import { uploadCsv } from "../middlewares/multer.middleware";
import { Rol } from "@prisma/client";

const router = Router();

// RUTAS PÚBLICAS (Lectura)
/**
 * @openapi
 * /api/productos:
 *   get:
 *     summary: Obtener todos los productos
 *     tags:
 *       - Productos
 *     responses:
 *       200:
 *         description: Lista de productos
 */
router.get("/", productoController.findAll.bind(productoController));
/**
 * @openapi
 * /api/productos/codigo/{codigo}:
 *   get:
 *     summary: Obtener un producto por su código personalizado
 *     tags:
 *       - Productos
 *     parameters:
 *       - name: codigo
 *         in: path
 *         required: true
 *         description: Código único del producto (ej. MOU-001)
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 producto_id:
 *                   type: integer
 *                 producto_codigo:
 *                   type: string
 *                 nombre:
 *                   type: string
 *                 precio:
 *                   type: number
 *                 stock:
 *                   type: integer
 *       '404':
 *         description: Producto no encontrado con ese código
 */
router.get("/codigo/:codigo", productoController.findByCodigo.bind(productoController));
/**
 * @openapi
 * /api/productos/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags:
 *       - Productos
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       404:
 *         description: Producto no encontrado
 */
router.get("/:id", productoController.findById.bind(productoController));


// RUTAS PROTEGIDAS (Modificación - Solo Administrador)
/**
 * @openapi
 * /api/productos:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags:
 *       - Productos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *               stock:
 *                 type: integer
 *               categoria_id:
 *                 type: integer
 *               imagen:
 *                 type: string
 *                 description: Imagen en formato Base64
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       400:
 *         description: Error de validación
 *       403:
 *         description: No autorizado
 */
router.post(
    "/",
    authenticateToken,
    authorizeRole([Rol.administrador]),
    productoController.create.bind(productoController)
);

/**
 * @openapi
 * /api/productos/carga-masiva:
 *   post:
 *     summary: Carga masiva de productos desde archivo CSV
 *     tags:
 *       - Productos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Archivo CSV con columnas BARRA, PRODUCTO y VENTA
 *     responses:
 *       200:
 *         description: Proceso de carga masiva finalizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Proceso de carga masiva finalizado.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       codigo:
 *                         type: string
 *                         description: Código de barras del producto
 *                       nombre:
 *                         type: string
 *                         description: Nombre del producto
 *                       precioVenta:
 *                         type: number
 *                         description: Precio de venta
 *                       categoriaId:
 *                         type: integer
 *                         description: Categoría asignada (ej. 0 = sin categoría)
 *                       imagen:
 *                         type: string
 *                         nullable: true
 *                       descripcion:
 *                         type: string
 *                         nullable: true
 *       400:
 *         description: Error de validación (archivo no enviado o inválido)
 *       500:
 *         description: Error interno al procesar el archivo
 */
router.post(
    '/carga-masiva',
    authenticateToken,
    authorizeRole([Rol.administrador]),
    uploadCsv,
    productoController.uploadCsv.bind(productoController)
);

/**
 * @openapi
 * /api/productos/{id}:
 *   put:
 *     summary: Actualizar un producto
 *     tags:
 *       - Productos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
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
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *               stock:
 *                 type: integer
 *               imagen:
 *                 type: string
 *                 description: Imagen en formato Base64
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       400:
 *         description: Error de validación
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Producto no encontrado
 */
router.put(
    "/:id",
    authenticateToken,
    authorizeRole([Rol.administrador]),
    productoController.update.bind(productoController)
);

/**
 * @openapi
 * /api/productos/{id}:
 *   delete:
 *     summary: Eliminar un producto
 *     tags:
 *       - Productos
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
 *         description: Producto eliminado
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Producto no encontrado
 */
router.delete(
    "/:id",
    authenticateToken,
    authorizeRole([Rol.administrador]),
    productoController.delete.bind(productoController)
);

export default router;