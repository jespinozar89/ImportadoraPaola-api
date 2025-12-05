import { Carrito } from '@prisma/client';
import { CarritoDetalladoDTO } from '../dtos/carrito.dto';

export interface ICarritoRepository {
  addItem(usuario_id: number, producto_id: number, cantidad: number): Promise<Carrito>;
  updateQuantity(carrito_id: number, cantidad: number): Promise<Carrito>;
  findByUserAndProduct(usuario_id: number, producto_id: number): Promise<Carrito | null>;
  findAllByUserId(usuario_id: number): Promise<Carrito[]>;
  removeItem(carrito_id: number): Promise<Carrito>;
  clearCart(usuario_id: number): Promise<number>;
  getDetailedCartByUserId(usuarioId: number): Promise<CarritoDetalladoDTO[]>
}