/*
  Warnings:

  - A unique constraint covering the columns `[producto_codigo]` on the table `Productos` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Productos` ADD COLUMN `producto_codigo` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Favorito` (
    `favorito_id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `producto_id` INTEGER NOT NULL,
    `fecha_agregado` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Favorito_usuario_id_producto_id_key`(`usuario_id`, `producto_id`),
    PRIMARY KEY (`favorito_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Carrito` (
    `carrito_id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `producto_id` INTEGER NOT NULL,
    `cantidad` INTEGER NOT NULL DEFAULT 1,
    `fecha_agregado` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Carrito_usuario_id_producto_id_key`(`usuario_id`, `producto_id`),
    PRIMARY KEY (`carrito_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Productos_producto_codigo_key` ON `Productos`(`producto_codigo`);

-- AddForeignKey
ALTER TABLE `Favorito` ADD CONSTRAINT `Favorito_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `Usuarios`(`usuario_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Favorito` ADD CONSTRAINT `Favorito_producto_id_fkey` FOREIGN KEY (`producto_id`) REFERENCES `Productos`(`producto_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Carrito` ADD CONSTRAINT `Carrito_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `Usuarios`(`usuario_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Carrito` ADD CONSTRAINT `Carrito_producto_id_fkey` FOREIGN KEY (`producto_id`) REFERENCES `Productos`(`producto_id`) ON DELETE CASCADE ON UPDATE CASCADE;
