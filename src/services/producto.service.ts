import { CreateProductoDTO, UpdateProductoDTO } from '../dtos/producto.dto';
import { IProductoRepository } from '../interfaces/producto.repository.interface';
import { Prisma } from '@prisma/client';

export class ProductoService {
  constructor(private productoRepository: IProductoRepository) {}

  async create(data: CreateProductoDTO) {
    if (data.producto_codigo) {
      const existe = await this.productoRepository.findByCodigo(data.producto_codigo);
      if (existe) {
        throw new Error(`El código de producto '${data.producto_codigo}' ya está en uso.`);
      }
    }

    const dataToCreate: Prisma.ProductoCreateInput = {
        ...data,
        precio: new Prisma.Decimal(data.precio),
        producto_codigo: data.producto_codigo ?? '',
    };

    return await this.productoRepository.create(dataToCreate);
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

  async findByCodigo(codigo: string) {
    const producto = await this.productoRepository.findByCodigo(codigo);
    if (!producto) {
      throw new Error(`Producto con código ${codigo} no encontrado.`);
    }
    return producto;
  }
  
  async update(id: number, data: UpdateProductoDTO) {

    if (data.producto_codigo) {
       const existe = await this.productoRepository.findByCodigo(data.producto_codigo);
       
       if (existe && existe.producto_id !== id) {
          throw new Error(`El código '${data.producto_codigo}' ya pertenece a otro producto.`);
       }
    }

    await this.findById(id); 
    
    const { precio, ...rest } = data;
    const dataToUpdate: Prisma.ProductoUpdateInput = {
      ...rest,
      ...(precio !== undefined ? { precio: new Prisma.Decimal(precio) } : {}),
    };
    
    return await this.productoRepository.update(id, dataToUpdate);
  }

  async delete(id: number) {
    await this.findById(id);
    return await this.productoRepository.delete(id);
  }
}