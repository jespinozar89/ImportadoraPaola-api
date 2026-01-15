export interface CreateUserDTO {
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
  telefono?: string;
}

export interface UpdateUserDTO {
  nombres?: string;
  apellidos?: string;
  email?: string;
  telefono?: string;
  password?: string;
  rol?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface UsuarioPerfil {
  usuario_id?: number;
  nombres: string;
  apellidos: string;
  email: string;
  rol?: string;
}
