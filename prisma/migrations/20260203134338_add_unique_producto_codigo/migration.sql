/*
  Warnings:

  - A unique constraint covering the columns `[producto_codigo]` on the table `Productos` will be added. If there are existing duplicate values, this will fail.
  - Made the column `producto_codigo` on table `Productos` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Productos` MODIFY `producto_codigo` VARCHAR(250) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Productos_producto_codigo_key` ON `Productos`(`producto_codigo`);
