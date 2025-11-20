import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Rol } from '@prisma/client'; // Importamos el enum Rol de Prisma

// ⚠️ Interfaz extendida para inyectar datos del usuario
export interface AuthRequest extends Request {
  usuarioId?: number;
  rol?: Rol;
}

// Obtener la clave secreta del entorno o usar un valor por defecto
const JWT_SECRET = process.env.JWT_SECRET || 'mi_secreto_ultra_seguro_default'; 

/**
 * Middleware para autenticar al usuario usando un token JWT.
 */
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  // El formato esperado es: "Bearer [TOKEN]"
  const token = authHeader && authHeader.split(' ')[1]; 

  if (token == null) {
    // 401: No autorizado (Token faltante)
    return res.status(401).json({ message: 'Token de acceso no proporcionado.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      // 403: Prohibido (Token inválido o expirado)
      return res.status(403).json({ message: 'Token de acceso inválido o expirado.' });
    }

    // Si el token es válido, inyectamos el ID y el Rol en el objeto Request
    const payload = user as { id: number, rol: Rol };
    req.usuarioId = payload.id;
    req.rol = payload.rol;

    next(); // Continúa al siguiente middleware o controlador
  });
};

/**
 * Middleware para restringir el acceso basado en el Rol.
 * @param requiredRoles Array de roles permitidos (ej. [Rol.administrador])
 */
export const authorizeRole = (requiredRoles: Rol[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        // req.rol fue inyectado por authenticateToken
        if (!req.rol || !requiredRoles.includes(req.rol)) {
            // 403: Prohibido (Rol insuficiente)
            return res.status(403).json({ message: 'Permisos insuficientes para esta operación.' });
        }
        next();
    };
};