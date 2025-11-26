export interface CreateCategoriaDTO {
  nombre: string;
  descripcion?: string;
}

export interface UpdateCategoriaDTO {
  nombre?: string;
  descripcion?: string;
  estado?: 'Activo' | 'Inactivo';
}