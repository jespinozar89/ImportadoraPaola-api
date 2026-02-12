import prisma from "../config/prisma";
import { Favorito } from '@prisma/client';
import { IFavoritoRepository } from '../interfaces/favorito.repository.interface';

export class PrismaFavoritoRepository implements IFavoritoRepository {

  async add(usuario_id: number, producto_id: number): Promise<Favorito> {
    return await prisma.favorito.create({
      data: {
        usuario_id,
        producto_id
      }
    });
  }

  async remove(usuario_id: number, producto_id: number): Promise<Favorito | null> {
    const favorito = await this.exists(usuario_id, producto_id);
    if (!favorito) return null;

    await prisma.favorito.delete({
      where: {
        favorito_id: favorito.favorito_id
      }
    });

    return favorito;
  }

  async findAllByUser(usuario_id: number): Promise<Favorito[]> {
    return await prisma.favorito.findMany({
      where: { usuario_id },
      include: {
        producto: true
      },
      orderBy: { fecha_agregado: 'desc' }
    });
  }

  async exists(usuario_id: number, producto_id: number): Promise<Favorito | null> {
    return await prisma.favorito.findUnique({
      where: {
        usuario_id_producto_id: {
          usuario_id,
          producto_id
        }
      }
    });
  }
}