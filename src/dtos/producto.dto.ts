export interface CreateProductoDTO {
  nombre: string;
  descripcion?: string;
  imagen?: string; 
  precio: number;
  stock: number;
  categoria_id: number;
}

export interface UpdateProductoDTO {
  nombre?: string;
  descripcion?: string;
  imagen?: string;
  precio?: number;
  stock?: number;
  categoria_id?: number;
}