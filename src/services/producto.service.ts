import { CreateProductoDTO, UpdateProductoDTO } from '../dtos/producto.dto';
import { IProductoRepository } from '../interfaces/producto.repository.interface';
import { Prisma } from '@prisma/client';

export class ProductoService {
  constructor(private productoRepository: IProductoRepository) {}

  async create(data: CreateProductoDTO) {
    // ⚠️ LÓGICA CLAVE DE BASE64:
    // Aquí podrías añadir una validación para asegurar que la cadena 'imagen' 
    // tenga el formato esperado (ej. tamaño máximo, prefijo 'data:image/jpeg;base64,').

    // Convertimos el precio de number (del DTO) a Decimal (para Prisma/BD)
    const dataToCreate: Prisma.ProductoCreateInput = {
        ...data,
        precio: new Prisma.Decimal(data.precio),
    };

    const producto = await this.productoRepository.create(dataToCreate);
    return producto;
  }

  async findAll() {
    return await this.productoRepository.findAll();
  }

  async findById(id: number) {
    const producto = await this.productoRepository.findById(id);
    if (!producto) {
      throw new Error(`Producto con ID ${id} no encontrado.`);
    }
    return producto;
  }
  
  async update(id: number, data: UpdateProductoDTO) {
    await this.findById(id); // Verificamos existencia
    
    // Construimos el objeto de actualización sin incluir propiedades undefined
    const { precio, ...rest } = data;
    const dataToUpdate: Prisma.ProductoUpdateInput = {
      ...rest,
      ...(precio !== undefined ? { precio: new Prisma.Decimal(precio) } : {}),
    };
    
    return await this.productoRepository.update(id, dataToUpdate);
  }

  async delete(id: number) {
    await this.findById(id); // Verificamos existencia
    return await this.productoRepository.delete(id);
  }
}