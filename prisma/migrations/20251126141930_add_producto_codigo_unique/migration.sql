/*
  Warnings:

  - Made the column `producto_codigo` on table `Productos` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Productos` MODIFY `producto_codigo` VARCHAR(191) NOT NULL;
