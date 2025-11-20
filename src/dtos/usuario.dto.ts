export interface CreateUserDTO {
  nombres: string;
  apellidos: string;
  email: string;
  password: string; // Será hasheada en el servicio
  telefono?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}