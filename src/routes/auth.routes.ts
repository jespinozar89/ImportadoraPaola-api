import { Router } from "express";
import { authController } from "../config/container"; 
import { authenticateToken } from "../middlewares/auth.middleware";


const router = Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombres:
 *                 type: string
 *               apellidos:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               telefono:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Error de validación o usuario ya existe
 */
router.post("/register", authController.register.bind(authController));
/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso, devuelve token JWT
 *       401:
 *         description: Credenciales inválidas
 */
router.post("/login", authController.login.bind(authController));

/**
 * @openapi
 * /api/auth/updatePerfil:
 *   put:
 *     summary: Actualizar el perfil del usuario autenticado
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombres:
 *                 type: string
 *                 example: string
 *               apellidos:
 *                 type: string
 *                 example: string
 *               email:
 *                 type: string
 *                 example: string
 *               telefono:
 *                 type: string
 *                 example: string
 *               password:
 *                 type: string
 *                 example: string
 *     responses:
 *       200:
 *         description: Perfil actualizado correctamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: Usuario no autenticado
 *       500:
 *         description: Error interno al actualizar el perfil
 */
router.put('/updatePerfil', authenticateToken, authController.updatePerfil.bind(authController));

/**
 * @openapi
 * /api/auth/generateResetToken:
 *   put:
 *     summary: Generar y actualizar token de restablecimiento de contraseña
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@dominio.com
 *     responses:
 *       200:
 *         description: Token actualizado y enlace de recuperación enviado correctamente
 *       400:
 *         description: Error en la solicitud (correo faltante o no registrado)
 *       500:
 *         description: Error interno al generar el token de recuperación
 */
router.put('/generateResetToken', authController.generateResetToken.bind(authController));

/**
 * @openapi
 * /api/auth/resetPassword:
 *   put:
 *     summary: Restablecer la contraseña del usuario
 *     description: |
 *       Permite al usuario restablecer su contraseña utilizando un token de recuperación válido.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *               password:
 *                 type: string
 *                 example: NuevaPassword123!
 *     responses:
 *       200:
 *         description: Contraseña restablecida correctamente
 *       400:
 *         description: Error en la solicitud (datos incompletos o token inválido)
 *       500:
 *         description: Error interno al restablecer la contraseña
 */
router.put('/resetPassword', authController.resetPassword.bind(authController));

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []   # Indica que requiere JWT en el header Authorization
 *     responses:
 *       200:
 *         description: Perfil del usuario autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usuario_id:
 *                   type: integer
 *                 nombres:
 *                   type: string
 *                 apellidos:
 *                   type: string
 *                 email:
 *                   type: string
 *                 rol:
 *                   type: string
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Permisos insuficientes
 */
router.get('/me', authenticateToken, authController.getPerfil.bind(authController));

export default router;