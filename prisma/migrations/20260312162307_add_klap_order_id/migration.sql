/*
  Warnings:

  - You are about to drop the column `comprobante_pago` on the `Pedidos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Pedidos` DROP COLUMN `comprobante_pago`,
    ADD COLUMN `klapOrderId` VARCHAR(64) NULL;
