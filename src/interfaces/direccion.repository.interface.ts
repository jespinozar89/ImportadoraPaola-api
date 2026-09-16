import { DireccionUsuario } from '@prisma/client';
import { CreateDireccionDTO, UpdateDireccionDTO } from '../dtos/direccion.dto';

export interface IDireccionRepository {
  findByUsuarioId(usuarioId: number): Promise<DireccionUsuario[]>;
  findById(direccionId: number): Promise<DireccionUsuario | null>;
  countByUsuarioId(usuarioId: number): Promise<number>;
  create(data: CreateDireccionDTO): Promise<DireccionUsuario>;
  update(direccionId: number, data: UpdateDireccionDTO): Promise<DireccionUsuario>;
  delete(direccionId: number): Promise<DireccionUsuario>;
  quitarPredeterminadas(usuarioId: number): Promise<void>;
  marcarComoPredeterminada(direccionId: number): Promise<DireccionUsuario>;
  findFirstByUsuarioId(usuarioId: number): Promise<DireccionUsuario | null>;
}