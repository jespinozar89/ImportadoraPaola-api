// 1. Las columnas EXACTAS de tu CSV
export interface ProductoCsvRow {
  BARRA: string;    // Columna 1
  PRODUCTO: string; // Columna 2
  VENTA: string;    // Columna 'VENTA' (csv-parser la lee como string)
}

export interface CargaMasivaResult {
  procesados: number;
  insertados: number;
}

