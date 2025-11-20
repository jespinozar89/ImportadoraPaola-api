import { CreateCategoriaDTO, UpdateCategoriaDTO } from '../dtos/categoria.dto';
import { ICategoriaRepository } from '../interfaces/categoria.repository.interface';

export class CategoriaService {
    
  // Inyección de Dependencia: Recibimos el repositorio en el constructor
  constructor(private categoriaRepository: ICategoriaRepository) {}

  async create(data: CreateCategoriaDTO) {
    const categoria = await this.categoriaRepository.create(data);
    return categoria;
  }

  async findAll() {
    return await this.categoriaRepository.findAll();
  }
  
  async findById(id: number) {
    const categoria = await this.categoriaRepository.findById(id);
    if (!categoria) {
      // Lanzamos un error que el controlador atrapará para enviar 404
      throw new Error(`Categoría con ID ${id} no encontrada.`);
    }
    return categoria;
  }

  async update(id: number, data: UpdateCategoriaDTO) {
    await this.findById(id); // Verificamos que exista antes de actualizar
    return await this.categoriaRepository.update(id, data);
  }

  async delete(id: number) {
    await this.findById(id); // Verificamos que exista antes de "eliminar"
    return await this.categoriaRepository.delete(id);
  }
}