export interface ImagenDTO {
  imagen_id?: number;
  url: string;
  es_principal?: boolean;
  orden?: number;
}

export interface CreateProductoDTO {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  producto_codigo?: string;
  categoria_id: number;
  imagenes?: ImagenDTO[];
}

export interface UpdateProductoDTO {
  nombre?: string;
  descripcion?: string;
  precio?: number;
  stock?: number;
  producto_codigo?: string;
  categoria_id?: number;
  imagenes?: ImagenDTO[];
}