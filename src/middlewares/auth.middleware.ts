import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Rol } from '@prisma/client';

export interface AuthRequest extends Request {
  usuarioId?: number | undefined;
  rol?: Rol | undefined;
  email?: string;
  nombre?: string;
}

const getJwtSecret = (res: Response): string | undefined => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ message: 'La autenticación no está configurada correctamente.' });
    return undefined;
  }
  return secret;
};

/**
 * Middleware para autenticar obligatoriamente al usuario usando un token JWT.
 */
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'Token de acceso no proporcionado.' });
  }

  const jwtSecret = getJwtSecret(res);
  if (!jwtSecret) return;

  jwt.verify(token, jwtSecret, (err: jwt.VerifyErrors | null, user: jwt.JwtPayload | string | undefined) => {
    if (err) {
      return res.status(401).json({ message: 'Token de acceso inválido o expirado.' });
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
  const token = req.cookies?.token;

  if (!token) {
    req.usuarioId = undefined;
    req.rol = undefined;
    return next();
  }

  const jwtSecret = getJwtSecret(res);
  if (!jwtSecret) return;

  jwt.verify(token, jwtSecret, (err: jwt.VerifyErrors | null, user: jwt.JwtPayload | string | undefined) => {
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