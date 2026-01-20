/*
  Warnings:

  - A unique constraint covering the columns `[reset_token]` on the table `Usuarios` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Usuarios` ADD COLUMN `reset_token` VARCHAR(191) NULL,
    ADD COLUMN `reset_token_expiry` DATETIME(3) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Usuarios_reset_token_key` ON `Usuarios`(`reset_token`);
