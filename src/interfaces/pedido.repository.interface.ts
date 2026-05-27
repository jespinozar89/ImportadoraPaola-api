import { PaginatedResult } from '@/dtos/paginated.dto';
import { CreatePedidoDTO } from '@/dtos/pedido.dto';
import { Pedido } from '@prisma/client';

export interface IPedidoRepository {
  createTransaction(data: CreatePedidoDTO): Promise<Pedido>;
  findAll(): Promise<Pedido[]>;
  findByUserId(userId: number, page: number, limit: number, search?: string): Promise<PaginatedResult<any>> 
  findOrderByUserIdAndPedidoId(userId: number, pedidoId: number): Promise<Pedido | null> 
  findById(id: number): Promise<Pedido | null>;
  findByKlapId(id: string): Promise<Pedido | null>;
  updateStatus(id: number, estado: any): Promise<Pedido>;
}