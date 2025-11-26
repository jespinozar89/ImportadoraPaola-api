import { Favorito } from '@prisma/client';

export interface IFavoritoRepository {
  add(usuario_id: number, producto_id: number): Promise<Favorito>;
  remove(usuario_id: number, producto_id: number): Promise<Favorito | null>;
  findAllByUser(usuario_id: number): Promise<Favorito[]>;
  exists(usuario_id: number, producto_id: number): Promise<Favorito | null>;
}