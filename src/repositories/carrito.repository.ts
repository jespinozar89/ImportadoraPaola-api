import { PrismaClient, Carrito } from '@prisma/client';
import { ICarritoRepository } from '../interfaces/carrito.repository.interface';
import { CarritoDetalladoDTO } from '../dtos/carrito.dto';

const prisma = new PrismaClient();

export class PrismaCarritoRepository implements ICarritoRepository {

  async addItem(usuario_id: number, producto_id: number, cantidad: number): Promise<Carrito> {
    return await prisma.carrito.create({
      data: {
        usuario_id,
        producto_id,
        cantidad,
      }
    });
  }

  async updateQuantity(carrito_id: number, cantidad: number): Promise<Carrito> {
    return await prisma.carrito.update({
      where: { carrito_id },
      data: { cantidad }
    });
  }

  async findByUserAndProduct(usuario_id: number, producto_id: number): Promise<Carrito | null> {
    return await prisma.carrito.findUnique({
      where: {
        usuario_id_producto_id: {
          usuario_id,
          producto_id
        }
      }
    });
  }

  async findAllByUserId(usuario_id: number): Promise<Carrito[]> {
    return await prisma.carrito.findMany({
      where: { usuario_id },
      include: {
        producto: true
      },
      orderBy: { fecha_agregado: 'asc' }
    });
  }

  async removeItem(carrito_id: number): Promise<Carrito> {
    return await prisma.carrito.delete({
      where: { carrito_id }
    });
  }

  async clearCart(usuario_id: number): Promise<number> {
    const { count } = await prisma.carrito.deleteMany({
      where: { usuario_id }
    });
    return count;
  }

  async getDetailedCartByUserId(usuarioId: number): Promise<CarritoDetalladoDTO[]> {
    // 💡 Aquí se usa la función de JOIN de tu ORM/BD.
    // Ejemplo de lo que se buscaría:
    const detailedItems = await prisma.carrito.findMany({
      where: { usuario_id: usuarioId },
      select: {
        carrito_id: true,
        cantidad: true,
        producto: {
          select: {
            producto_id: true,
            nombre: true,
            precio: true,
            imagen: true,
          }
        }
      }
    });
    
    return detailedItems.map(item => ({
      carrito_id: item.carrito_id,
      cantidad: item.cantidad,
      producto_id: item.producto.producto_id,
      nombre: item.producto.nombre,
      precio: Number(item.producto.precio), 
      imagen: item.producto.imagen ?? ""   
    }));
  }
}