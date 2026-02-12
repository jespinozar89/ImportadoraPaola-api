import prisma from "../config/prisma";
import { Categoria, Prisma } from '@prisma/client';
import { ICategoriaRepository } from '../interfaces/categoria.repository.interface';

export class PrismaCategoriaRepository implements ICategoriaRepository {

    async create(data: Prisma.CategoriaCreateInput): Promise<Categoria> {
        return await prisma.categoria.create({ data });
    }

    async findAll(): Promise<Categoria[]> {
        const categorias = await prisma.categoria.findMany({
            include: {
                _count: {
                    select: {
                        productos: true
                    }
                }
            }
        });

        return categorias.map(cat => ({
            ...cat,
            totalProductos: cat._count.productos
        }));
    }

    async findById(id: number): Promise<Categoria | null> {
        return await prisma.categoria.findUnique({ where: { categoria_id: id } });
    }

    async update(id: number, data: Prisma.CategoriaUpdateInput): Promise<Categoria> {
        return await prisma.categoria.update({ where: { categoria_id: id }, data });
    }

    async delete(id: number): Promise<Categoria> {
        return await prisma.categoria.delete({
            where: { categoria_id: id },
        });
    }

}