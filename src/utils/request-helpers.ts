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
}
