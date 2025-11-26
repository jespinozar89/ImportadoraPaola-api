-- DropIndex
DROP INDEX `Productos_producto_codigo_key` ON `Productos`;

-- AlterTable
ALTER TABLE `Productos` MODIFY `producto_codigo` VARCHAR(250) NULL;
