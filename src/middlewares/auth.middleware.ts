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