import { Request, Response } from 'express';

export class RequestHelpers {

  static getIdParam(req: Request, res: Response): number | null {
    const idParam = req.params.id;

    if (!idParam) {
      res.status(400).json({ message: 'El id es requerido' });
      return null;
    }

    const id = Number(idParam);

    if (Number.isNaN(id)) {
      res.status(400).json({ message: 'Id inválido' });
      return null;
    }

    return id;
  }

  static getBodyField<T>(req: Request, res: Response, field: string): T | null {
    const value = req.body?.[field];

    if (value === undefined || value === null) {
      res.status(400).json({ message: `El campo '${field}' es requerido.` });
      return null;
    }

    return value as T;
  }

  static validateNumericQueryParam(req: Request, res: Response, key: string): number | null {
    const value = req.query?.[key];

    if (!value) {
      res.status(400).json({ message: `El parámetro '${key}' es requerido.` });
      return null;
    }

    const num = Number(value);
    if (Number.isNaN(num)) {
      res.status(400).json({ message: `El parámetro '${key}' debe ser numérico.` });
      return null;
    }

    return num;
  }

  static sendError(res: Response, status: number, message: string): void {
    res.status(status).json({ message });
  }

}
