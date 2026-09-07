import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando migración de categorías...');

  // 1. Obtener todos los productos que tienen categoria_id
  const productos = await prisma.producto.findMany({
    where: {
      categoria_id: { not: null }
    },
    select: {
      producto_id: true,
      categoria_id: true
    }
  });

  console.log(`Se encontraron ${productos.length} productos para migrar.`);

  let migrados = 0;

  for (const prod of productos) {
    if (prod.categoria_id) {
      // 2. Insertar en ProductosCategorias evitando duplicados si ya existen
      await prisma.productoCategoria.upsert({
        where: {
          producto_id_categoria_id: {
            producto_id: prod.producto_id,
            categoria_id: prod.categoria_id
          }
        },
        update: {},
        create: {
          producto_id: prod.producto_id,
          categoria_id: prod.categoria_id
        }
      });
      migrados++;
    }
  }

  console.log(`¡Migración completada con éxito! ${migrados} registros procesados.`);
}

main()
  .catch((e) => {
    console.error('Error durante la migración:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });