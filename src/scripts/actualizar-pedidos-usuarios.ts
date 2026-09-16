import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function actualizarDatosPedidos() {
  console.log('🚀 Iniciando la actualización de datos en la tabla Pedidos...');

  try {
    // 1. Obtener todos los pedidos que tienen un usuario_id asociado
    const pedidos = await prisma.pedido.findMany({
      where: {
        usuario_id: {
          not: null
        }
      },
      select: {
        pedido_id: true,
        usuario_id: true
      }
    });

    console.log(`📋 Se encontraron ${pedidos.length} pedidos asociados a usuarios.`);

    if (pedidos.length === 0) {
      console.log('No hay pedidos para actualizar.');
      return;
    }

    // 2. Obtener los IDs de los usuarios involucrados
    const usuarioIds = [...new Set(pedidos.map(p => p.usuario_id!).filter(Boolean))];

    // 3. Buscar los datos de esos usuarios en la BD
    const usuarios = await prisma.usuario.findMany({
      where: {
        usuario_id: { in: usuarioIds }
      },
      select: {
        usuario_id: true,
        email: true,
        nombres: true,
        apellidos: true,
        telefono: true
      }
    });

    // Crear un mapa para buscar rápidamente los datos del usuario por ID
    const usuariosMap = new Map(usuarios.map(u => [u.usuario_id, u]));

    let actualizados = 0;
    let omitidos = 0;

    // 4. Actualizar pedido por pedido (evita bloqueos de BD)
    for (const pedido of pedidos) {
      const usuario = usuariosMap.get(pedido.usuario_id!);

      if (usuario) {
        const nombreContacto = `${usuario.nombres || ''} ${usuario.apellidos || ''}`.trim();

        await prisma.pedido.update({
          where: {
            pedido_id: pedido.pedido_id
          },
          data: {
            direccion_envio: 'Retiro en tienda.',
            email_contacto: usuario.email,
            nombre_contacto: nombreContacto,
            telefono_contacto: usuario.telefono || '00000000'
          }
        });

        actualizados++;
        if (actualizados % 50 === 0) {
          console.log(`⏳ Progresos: ${actualizados}/${pedidos.length} pedidos actualizados...`);
        }
      } else {
        omitidos++;
      }
    }

    console.log(`\n✅ ¡Proceso finalizado con éxito!`);
    console.log(`📊 Resumen: ${actualizados} pedidos actualizados, ${omitidos} omitidos.`);

  } catch (error) {
    console.error('❌ Error durante la actualización:', error);
  } finally {
    await prisma.$disconnect();
  }
}

actualizarDatosPedidos();