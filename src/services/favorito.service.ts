import { IFavoritoRepository } from '../interfaces/favorito.repository.interface';
import { AddFavoritoDTO } from '../dtos/favorito.dto';
import prisma from "../config/prisma";

export class FavoritoService {
  constructor(private favoritoRepository: IFavoritoRepository) {}

  async addFavorito(usuarioId: number, data: AddFavoritoDTO) {

    const producto = await prisma.producto.findUnique({ where: { producto_id: data.producto_id } });
    if (!producto) throw new Error("El producto no existe");

    const existe = await this.favoritoRepository.exists(usuarioId, data.producto_id);
    if (existe) throw new Error("El producto ya está en tus favoritos");

    return await this.favoritoRepository.add(usuarioId, data.producto_id);
  }

  async removeFavorito(usuarioId: number, productoId: number) {
    const eliminado = await this.favoritoRepository.remove(usuarioId, productoId);
    if (!eliminado) throw new Error("El producto no estaba en favoritos");
    return eliminado;
  }

  async getMyFavoritos(usuarioId: number) {
    return await this.favoritoRepository.findAllByUser(usuarioId);
  }
}