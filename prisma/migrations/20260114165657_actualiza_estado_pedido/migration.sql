/*
  Warnings:

  - The values [En Preparacion,Listo para Retiro,Retirado] on the enum `Pedidos_estado` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Pedidos` MODIFY `estado` ENUM('Pendiente', 'EnPreparacion', 'Listo', 'Entregado', 'Cancelado') NOT NULL DEFAULT 'Pendiente';
