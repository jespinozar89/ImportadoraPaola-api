export interface CreateProductoDTO {
  nombre: string;
  descripcion: string;
  imagen?: string; 
  precio: number;
  stock: number;
  producto_codigo?: string;
  categoria_id: number;
}

export interface UpdateProductoDTO {
  nombre?: string;
  descripcion?: string;
  imagen?: string;
  precio?: number;
  stock?: number;
  producto_codigo: string;
  categoria_id?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    last_page: number;
  };
}