import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Rol } from '@prisma/client';

export interface AuthRequest extends Request {
  usuarioId?: number | undefined;
  rol?: Rol | undefined;
  email?: string;
  nombre?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_fallback';

/**
 * Middleware para autenticar obligatoriamente al usuario usando un token JWT.
 */
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token de acceso no proporcionado.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token de acceso inválido o expirado.' });
    }

    const payload = user as { id: number; rol: Rol; email: string; nombre: string };
    req.usuarioId = payload.id;
    req.rol = payload.rol;
    req.email = payload.email;
    req.nombre = payload.nombre;

    next();
  });
};

/**
 * Middleware para autenticación OPCIONAL.
 * 
 * - Si no hay token o es inválido: Permite continuar la petición como INVITADO (req.usuarioId será undefined).
 * - Si el token es válido: Inyecta los datos del usuario en el Request (req.usuarioId, req.rol, etc.).
 */
export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.usuarioId = undefined;
    req.rol = undefined;
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (!err && user) {
      const payload = user as { id: number; rol: Rol; email: string; nombre: string };
      req.usuarioId = payload.id;
      req.rol = payload.rol;
      req.email = payload.email;
      req.nombre = payload.nombre;
    } else {
      req.usuarioId = undefined;
      req.rol = undefined;
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