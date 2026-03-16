/*
  Warnings:

  - You are about to drop the column `klapOrderId` on the `Pedidos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Pedidos` DROP COLUMN `klapOrderId`,
    ADD COLUMN `klap_order_id` VARCHAR(64) NULL;
