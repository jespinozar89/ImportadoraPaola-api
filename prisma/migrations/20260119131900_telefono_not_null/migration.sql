/*
  Warnings:

  - Made the column `telefono` on table `Usuarios` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Usuarios` MODIFY `telefono` VARCHAR(20) NOT NULL;
