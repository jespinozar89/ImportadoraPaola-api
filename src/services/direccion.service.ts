import { IDireccionRepository } from '../interfaces/direccion.repository.interface';
import { CreateDireccionDTO, UpdateDireccionDTO } from '../dtos/direccion.dto';

export class DireccionService {
  constructor(private direccionRepository: IDireccionRepository) {}

  async obtenerDireccionesPorUsuario(usuarioId: number) {
    return await this.direccionRepository.findByUsuarioId(usuarioId);
  }

  async crearDireccion(dto: CreateDireccionDTO) {
    if (!dto.usuario_id) throw new Error("Usuario no especificado");

    const totalDirecciones = await this.direccionRepository.countByUsuarioId(dto.usuario_id);

    if (totalDirecciones === 0) {
      dto.es_predeterminada = true;
    } else if (dto.es_predeterminada) {
      await this.direccionRepository.quitarPredeterminadas(dto.usuario_id);
    }

    return await this.direccionRepository.create(dto);
  }

  async actualizarDireccion(id: number, usuarioId: number, dto: UpdateDireccionDTO) {
    const direccion = await this.direccionRepository.findById(id);

    if (!direccion || direccion.usuario_id !== usuarioId) {
      throw new Error("Dirección no encontrada o no pertenece al usuario.");
    }

    if (dto.es_predeterminada) {
      await this.direccionRepository.quitarPredeterminadas(usuarioId);
    }

    return await this.direccionRepository.update(id, dto);
  }

  async eliminarDireccion(id: number, usuarioId: number) {
    const direccion = await this.direccionRepository.findById(id);

    if (!direccion || direccion.usuario_id !== usuarioId) {
      throw new Error("Dirección no encontrada o no pertenece al usuario.");
    }

    const eliminada = await this.direccionRepository.delete(id);

    if (direccion.es_predeterminada) {
      const siguienteDireccion = await this.direccionRepository.findFirstByUsuarioId(usuarioId);
      if (siguienteDireccion) {
        await this.direccionRepository.marcarComoPredeterminada(siguienteDireccion.direccion_id);
      }
    }

    return { message: "Dirección eliminada correctamente", direccion: eliminada };
  }

  async cambiarPredeterminada(id: number, usuarioId: number) {
    const direccion = await this.direccionRepository.findById(id);

    if (!direccion || direccion.usuario_id !== usuarioId) {
      throw new Error("Dirección no encontrada o no pertenece al usuario.");
    }

    await this.direccionRepository.quitarPredeterminadas(usuarioId);
    return await this.direccionRepository.marcarComoPredeterminada(id);
  }
}