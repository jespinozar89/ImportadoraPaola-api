import { Readable } from 'stream';
import csv from 'csv-parser';
import { CreateProductoDTO, UpdateProductoDTO } from '../dtos/producto.dto';
import { IProductoRepository } from '../interfaces/producto.repository.interface';
import { Prisma, Producto } from '@prisma/client';
import { CargaMasivaResult, ProductoCsvRow } from '@/dtos/archivoCSV.dto';

export class ProductoService {
  constructor(private productoRepository: IProductoRepository) { }

  async create(data: CreateProductoDTO): Promise<Producto> {
    if (data.producto_codigo) {
      const existe = await this.productoRepository.findByCodigo(data.producto_codigo);
      if (existe) {
        throw new Error(`El código '${data.producto_codigo}' ya está registrado.`);
      }
    }

    return await this.productoRepository.create(data);
  }

  async findAll(page: number, limit: number, filtros: any) {
    return await this.productoRepository.findAll(page, limit, filtros);
  }

  async findById(id: number) {
    const producto = await this.productoRepository.findById(id);
    return producto;
  }

  async findByCodigo(codigo: string) {
    const producto = await this.productoRepository.findByCodigo(codigo);
    return producto;
  }

  async update(id: number, data: UpdateProductoDTO): Promise<Producto> {
    await this.findById(id);

    if (data.producto_codigo) {
      const existe = await this.productoRepository.findByCodigo(data.producto_codigo);
      if (existe && existe.producto_id !== Number(id)) {
        throw new Error(`El código '${data.producto_codigo}' ya pertenece a otro producto.`);
      }
    }

    return await this.productoRepository.update(Number(id), data);
  }

  async delete(id: number) {
    await this.findById(id);
    return await this.productoRepository.delete(id);
  }

  async procesarCargaMasiva(buffer: Buffer, idCategoria: number): Promise<CargaMasivaResult> {
    const productosAInsertar: CreateProductoDTO[] = [];
    const stream = Readable.from(buffer);

    return new Promise((resolve, reject) => {
      stream
        .pipe(csv({ separator: ',' }))
        .on('data', (row: any) => {
          try {
            if (!row.CODCATEGORIA && idCategoria === 0) {
              throw new Error('error');
            }

            if (row.BARRA && row.PRODUCTO) {
              const producto = this.mapRowToDto(row, idCategoria);
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

  private mapRowToDto(row: ProductoCsvRow, categoriaId: number): CreateProductoDTO {
    const precioLimpio = row.VENTA ? row.VENTA.toString().replace(/[^0-9]/g, '') : '0';

    if (row.CODCATEGORIA)
      categoriaId = Number(row.CODCATEGORIA);

    return {
      producto_codigo: row.BARRA,
      nombre: row.PRODUCTO,
      descripcion: row.PRODUCTO,
      precio: parseInt(precioLimpio, 10),
      stock: 1,
      categoria_id: categoriaId
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