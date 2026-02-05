import { Readable } from 'stream';
import csv from 'csv-parser';
import { CreateProductoDTO, UpdateProductoDTO } from '../dtos/producto.dto';
import { IProductoRepository } from '../interfaces/producto.repository.interface';
import { Prisma } from '@prisma/client';
import { CargaMasivaResult, ProductoCsvRow } from '@/dtos/archivoCSV.dto';

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

  async procesarCargaMasiva(buffer: Buffer): Promise<CargaMasivaResult> {
    const productosAInsertar: CreateProductoDTO[] = [];
    const stream = Readable.from(buffer);

    return new Promise((resolve, reject) => {
      stream
        .pipe(csv({ separator: ',' }))
        .on('data', (row: any) => {           
          try {
            if (row.BARRA && row.PRODUCTO) {
                const producto = this.mapRowToDto(row);
                if (this.isValid(producto)) {
                    productosAInsertar.push(producto);
                }
            }
          } catch (error) {
            console.warn('Fila omitida por error de formato:', row);
          }
        })
        .on('end', async () => {
          try {
            if (productosAInsertar.length > 0) {
              const count = await this.productoRepository.createBulk(productosAInsertar);
              resolve({ procesados: productosAInsertar.length, insertados: count });
            } else {
              resolve({ procesados: 0, insertados: 0 });
            }
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (error) => reject(error));
    });
  }

  private mapRowToDto(row: ProductoCsvRow): CreateProductoDTO {
    const precioLimpio = row.VENTA ? row.VENTA.toString().replace(/[^0-9]/g, '') : '0';

    return {
      producto_codigo: row.BARRA, 
      nombre: row.PRODUCTO,   
      descripcion: 'Sin descripción',      
      precio: parseInt(precioLimpio, 10),
      stock: 1,
      categoria_id: 19
    };
  }

  private isValid(dto: CreateProductoDTO): boolean {
    return (
      !!dto.nombre && 
      !!dto.producto_codigo &&
      !isNaN(dto.precio)
    );
  }
}