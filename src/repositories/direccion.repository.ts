import { DireccionUsuario } from '@prisma/client';
import prisma from '../config/prisma';
import { IDireccionRepository } from '../interfaces/direccion.repository.interface';
import { CreateDireccionDTO, UpdateDireccionDTO } from '../dtos/direccion.dto';

export class PrismaDireccionRepository implements IDireccionRepository {

  async findByUsuarioId(usuarioId: number): Promise<DireccionUsuario[]> {
    return await prisma.direccionUsuario.findMany({
      where: { usuario_id: usuarioId },
      orderBy: [
        { es_predeterminada: 'desc' },
        { direccion_id: 'desc' }
      ]
    });
  }

  async findById(direccionId: number): Promise<DireccionUsuario | null> {
    return await prisma.direccionUsuario.findUnique({
      where: { direccion_id: direccionId }
    });
  }

  async countByUsuarioId(usuarioId: number): Promise<number> {
    return await prisma.direccionUsuario.count({
      where: { usuario_id: usuarioId }
    });
  }

  async create(data: CreateDireccionDTO): Promise<DireccionUsuario> {
    return await prisma.direccionUsuario.create({
      data: {
        usuario_id: data.usuario_id!,
        calle: data.calle,
        numero: data.numero,
        departamento: data.departamento || null,
        comuna: data.comuna,
        region: data.region,
        es_predeterminada: data.es_predeterminada ?? false
      }
    });
  }

  async update(direccionId: number, data: UpdateDireccionDTO): Promise<DireccionUsuario> {
    return await prisma.direccionUsuario.update({
      where: { direccion_id: direccionId },
      data
    });
  }

  async delete(direccionId: number): Promise<DireccionUsuario> {
    return await prisma.direccionUsuario.delete({
      where: { direccion_id: direccionId }
    });
  }

  async quitarPredeterminadas(usuarioId: number): Promise<void> {
    await prisma.direccionUsuario.updateMany({
      where: { usuario_id: usuarioId },
      data: { es_predeterminada: false }
    });
  }

  async marcarComoPredeterminada(direccionId: number): Promise<DireccionUsuario> {
    return await prisma.direccionUsuario.update({
      where: { direccion_id: direccionId },
      data: { es_predeterminada: true }
    });
  }

  async findFirstByUsuarioId(usuarioId: number): Promise<DireccionUsuario | null> {
    return await prisma.direccionUsuario.findFirst({
      where: { usuario_id: usuarioId }
    });
  }
}