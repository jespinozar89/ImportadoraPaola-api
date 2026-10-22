import axios from 'axios';
import { starkenConfig } from '../config/starken';
import { StarkenTrackingResponse } from '../dtos/starken.dto';

export class StarkenService {

  async getSingleTracking(ordenFlete: number): Promise<StarkenTrackingResponse> {
    try {
      const response = await axios.post<StarkenTrackingResponse>(
        `${starkenConfig.baseUrl}/getDetalleSeguimientoNuevo`,
        { ordenFlete },
        {
          headers: {
            'Content-Type': 'application/json',
            Rut: starkenConfig.rut,
            Clave: starkenConfig.clave,
          },
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('[Starken API Service Error]:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al consultar tracking en Starken');
    }
  }
}