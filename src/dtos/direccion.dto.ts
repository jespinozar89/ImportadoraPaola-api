export interface CreateDireccionDTO {
  usuario_id: number;
  calle: string;
  numero: string;
  departamento?: string;
  comuna: string;
  region: string;
  es_predeterminada?: boolean;
}

export interface UpdateDireccionDTO {
  calle?: string;
  numero?: string;
  departamento?: string;
  comuna?: string;
  region?: string;
  es_predeterminada?: boolean;
}