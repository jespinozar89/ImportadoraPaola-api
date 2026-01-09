import { CreatePedidoDTO } from '@/dtos/pedido.dto';
import { Pedido } from '@prisma/client';

export interface IPedidoRepository {
  createTransaction(data: CreatePedidoDTO): Promise<Pedido>;
  findAll(): Promise<Pedido[]>;
  findByUserId(userId: number): Promise<Pedido[]>;
  findById(id: number): Promise<Pedido | null>;
  updateStatus(id: number, estado: any): Promise<Pedido>;
}