// src/interfaces/pedido.repository.interface.ts

import { Pedido } from '@prisma/client';

// Estructura auxiliar para pasar los datos procesados al repositorio
export interface PedidoData {
  usuario_id: number;
  total: number;
  detalles: {
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
  }[];
}

export interface IPedidoRepository {
  createTransaction(data: PedidoData): Promise<Pedido>;
  findAll(): Promise<Pedido[]>;
  findByUserId(userId: number): Promise<Pedido[]>;
  findById(id: number): Promise<Pedido | null>;
  updateStatus(id: number, estado: any): Promise<Pedido>; // 'any' para simplificar el enum de prisma
}