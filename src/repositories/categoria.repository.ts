// src/repositories/categoria.repository.ts

import { PrismaClient, Categoria, Prisma } from '@prisma/client';
import { ICategoriaRepository } from '../interfaces/categoria.repository.interface';

const prisma = new PrismaClient();

export class PrismaCategoriaRepository implements ICategoriaRepository {

    async create(data: Prisma.CategoriaCreateInput): Promise<Categoria> {
        return await prisma.categoria.create({ data });
    }

    async findAll(): Promise<Categoria[]> {
        // Solo mostramos las activas por defecto
        return await prisma.categoria.findMany();
    }

    async findById(id: number): Promise<Categoria | null> {
        return await prisma.categoria.findUnique({ where: { categoria_id: id } });
    }

    async update(id: number, data: Prisma.CategoriaUpdateInput): Promise<Categoria> {
        return await prisma.categoria.update({ where: { categoria_id: id }, data });
    }

    async delete(id: number): Promise<Categoria> {
        // Hard delete: eliminamos el registro de la BD
        return await prisma.categoria.delete({
            where: { categoria_id: id },
        });
    }

}