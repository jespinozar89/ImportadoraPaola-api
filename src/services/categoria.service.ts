import { CreateCategoriaDTO, UpdateCategoriaDTO } from '../dtos/categoria.dto';
import { ICategoriaRepository } from '../interfaces/categoria.repository.interface';

export class CategoriaService {
    
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
      throw new Error(`Categoría con ID ${id} no encontrada.`);
    }
    return categoria;
  }

  async update(id: number, data: UpdateCategoriaDTO) {
    await this.findById(id); 
    return await this.categoriaRepository.update(id, data);
  }

  async delete(id: number) {
    await this.findById(id); 
    return await this.categoriaRepository.delete(id);
  }
}