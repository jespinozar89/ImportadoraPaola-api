import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Rol } from '@prisma/client'; 

export interface AuthRequest extends Request {
  usuarioId?: number;
  rol?: Rol;
}

const JWT_SECRET = process.env.JWT_SECRET; 

/**
 * Middleware para autenticar al usuario usando un token JWT.
 */
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (token == null) {
    return res.status(401).json({ message: 'Token de acceso no proporcionado.' });
  }

  jwt.verify(token, JWT_SECRET!, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token de acceso inválido o expirado.' });
    }

    const payload = user as { id: number, rol: Rol };
    req.usuarioId = payload.id;
    req.rol = payload.rol;

    next();
  });
};

/**
 * Controlador para obtener la lista de productos.
 * 
 * - Si el usuario no está autenticado o tiene rol de CLIENTE, 
 *   se fuerza el filtro `estado = 'Activo'`.
 * - Si el usuario tiene rol de ADMINISTRADOR, puede consultar 
 *   productos con cualquier estado (según query params).
 * 
 * @param req  Objeto de la petición HTTP extendido con `usuarioId` y `rol` (AuthRequest).
 * @param res  Objeto de la respuesta HTTP, usado para enviar los datos o errores al cliente.
 * @param next Función de middleware para pasar el control al siguiente manejador en caso de error.
 * @returns    Una respuesta JSON con la lista de productos filtrados y sus metadatos.
 */
export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next();
  }

  jwt.verify(token, JWT_SECRET!, (err, user) => {
    if (!err) {
      const payload = user as { id: number, nombre: string,rol: Rol };
      req.usuarioId = payload.id;
      req.rol = payload.rol;
    }
    next();
  });
};

/**
 * Middleware para restringir el acceso basado en el Rol.
 * @param requiredRoles Array de roles permitidos (ej. [Rol.administrador])
 */
export const authorizeRole = (requiredRoles: Rol[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.rol || !requiredRoles.includes(req.rol)) {
            return res.status(403).json({ message: 'Permisos insuficientes para esta operación.' });
        }
        next();
    };
};