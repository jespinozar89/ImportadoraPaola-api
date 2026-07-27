// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {
//   console.log('🚀 Iniciando migración de imágenes hacia ProductoImagen...');

//   // 1. Obtenemos los productos que tienen el campo 'imagen' poblado en la tabla 'Productos'
//   const productosConImagen = await prisma.producto.findMany({
//     where: {
//       AND: [
//         { imagen: { not: null } },
//         { imagen: { not: '' } }
//       ]
//     },
//     select: {
//       producto_id: true,
//       producto_codigo: true,
//       nombre: true,
//       imagen: true
//     }
//   });

//   console.log(`🔍 Se encontraron ${productosConImagen.length} productos con datos en la columna antigua 'imagen'.\n`);

//   let creados = 0;
//   let omitidos = 0;

//   for (const prod of productosConImagen) {
//     if (!prod.imagen) continue;

//     const textoImagen = prod.imagen.trim();

//     // 🛑 Validamos si ya existe el registro en la tabla ProductoImagen
//     const imagenExistente = await prisma.productoImagen.findFirst({
//       where: {
//         producto_id: prod.producto_id,
//         url: textoImagen
//       }
//     });

//     if (imagenExistente) {
//       console.log(`⏩ [Omitido] Producto [${prod.producto_codigo}] "${prod.nombre}" ya tiene la imagen registrada.`);
//       omitidos++;
//       continue;
//     }

//     // 🛡️ Verificamos si ya hay alguna imagen marcada como principal para este producto
//     const tienePrincipal = await prisma.productoImagen.findFirst({
//       where: {
//         producto_id: prod.producto_id,
//         es_principal: true
//       }
//     });

//     // 💾 Insertamos en ProductoImagen
//     await prisma.productoImagen.create({
//       data: {
//         producto_id: prod.producto_id,
//         url: textoImagen,
//         es_principal: !tienePrincipal, // Si no tiene principal, esta será la primera (true)
//         orden: 1
//       }
//     });

//     console.log(`✅ [Migrado] Producto [${prod.producto_codigo}] "${prod.nombre}" -> Imagen agregada.`);
//     creados++;
//   }

//   console.log('\n========================================');
//   console.log(`📊 RESUMEN DE MIGRACIÓN:`);
//   console.log(`   - Registros insertados: ${creados}`);
//   console.log(`   - Registros omitidos: ${omitidos}`);
//   console.log('========================================\n');
// }

// main()
//   .catch((e) => {
//     console.error('❌ Error ejecutando el script:', e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });