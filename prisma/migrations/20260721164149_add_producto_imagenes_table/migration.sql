-- CreateTable
CREATE TABLE `ProductoImagen` (
    `imagen_id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` MEDIUMTEXT NOT NULL,
    `es_principal` BOOLEAN NOT NULL DEFAULT false,
    `orden` INTEGER NOT NULL DEFAULT 0,
    `producto_id` INTEGER NOT NULL,

    INDEX `ProductoImagen_producto_id_idx`(`producto_id`),
    PRIMARY KEY (`imagen_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductoImagen` ADD CONSTRAINT `ProductoImagen_producto_id_fkey` FOREIGN KEY (`producto_id`) REFERENCES `Productos`(`producto_id`) ON DELETE CASCADE ON UPDATE CASCADE;
