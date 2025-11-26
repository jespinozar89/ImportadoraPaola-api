import { ICarritoRepository } from '../interfaces/carrito.repository.interface';
import { AddItemToCartDTO, UpdateItemQuantityDTO } from '../dtos/carrito.dto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CarritoService {
  constructor(private carritoRepository: ICarritoRepository) {}

  async addItem(usuarioId: number, data: AddItemToCartDTO) {
    const { producto_id, cantidad } = data;

    const producto = await prisma.producto.findUnique({ where: { producto_id } });
    if (!producto) throw new Error("Producto no encontrado.");
    
    if (cantidad <= 0) throw new Error("La cantidad debe ser positiva.");
    if (producto.stock < cantidad) throw new Error(`Stock insuficiente. Solo quedan ${producto.stock} unidades.`);

    const itemExistente = await this.carritoRepository.findByUserAndProduct(usuarioId, producto_id);

    if (itemExistente) {
      const nuevaCantidad = itemExistente.cantidad + cantidad;
      if (producto.stock < nuevaCantidad) throw new Error(`Stock insuficiente para agregar ${cantidad} unidades más. Límite: ${producto.stock}.`);

      return await this.carritoRepository.updateQuantity(itemExistente.carrito_id, nuevaCantidad);
    } else {
      return await this.carritoRepository.addItem(usuarioId, producto_id, cantidad);
    }
  }

  async updateItemQuantity(usuarioId: number, carritoId: number, data: UpdateItemQuantityDTO) {
    if (data.cantidad <= 0) {
      return this.carritoRepository.removeItem(carritoId);
    }
    
    const item = await prisma.carrito.findUnique({ where: { carrito_id: carritoId } });
    if (!item || item.usuario_id !== usuarioId) throw new Error("Item no encontrado o no pertenece al usuario.");
    
    const producto = await prisma.producto.findUnique({ where: { producto_id: item.producto_id } });
    if (producto && producto.stock < data.cantidad) throw new Error(`Stock insuficiente. Límite: ${producto.stock} unidades.`);

    return await this.carritoRepository.updateQuantity(carritoId, data.cantidad);
  }

  async removeItem(usuarioId: number, carritoId: number) {
    const item = await prisma.carrito.findUnique({ where: { carrito_id: carritoId } });
    if (!item || item.usuario_id !== usuarioId) throw new Error("Item no encontrado o no pertenece al usuario.");

    return await this.carritoRepository.removeItem(carritoId);
  }

  async getMyCart(usuarioId: number) {
    return await this.carritoRepository.findAllByUserId(usuarioId);
  }
}