import { getBaseLayout } from './base-layout';

/**
 * @param nombreCliente Nombre del usuario
 * @param nuevoEstado Pendiente, Preparado, Listo, Entregado, Cancelado
 * @param idPedido El código o ID del pedido
 */
export const getEstadoPedidoTemplate = (nombreCliente: string, nuevoEstado: string, idPedido: string) => {
  
  // Configuración de estilos según el estado
  const config: any = {
    'EnPreparacion': { color: '#0dcaf0', texto: '¡Buenas noticias! Estamos preparando tus productos.', estado: 'Preparando' },
    'Listo':     { color: '#6610f2', texto: 'Tu pedido ya está listo para ser retirado.', estado: 'Listo para retirar'},
    'Entregado': { color: '#198754', texto: 'El pedido ha sido entregado. ¡Esperamos que lo disfrutes!', estado: 'Entregado'},
    'Cancelado': { color: '#dc3545', texto: 'El pedido ha sido cancelado. Si tienes dudas, contáctanos.', estado: 'Cancelado'}
  };

  const info = config[nuevoEstado] || { color: '#0d6efd', texto: 'Tu pedido tiene una nueva actualización.', estado: 'Preparando'};

  const content = `
    <p>Hola <strong>${nombreCliente.split(" ")[0]}</strong>,</p>
    <p>Queremos informarte que hay una actualización en el estado de tu pedido <strong>#ORD-${idPedido.padStart(4, '0')}</strong>.</p>
    
    <div style="margin: 30px 0; padding: 25px; border-radius: 10px; background-color: #fcfcfc; border: 1px solid #eeeeee; border-top: 5px solid ${info.color}; text-align: center;">
      <span style="display: block; font-size: 11px; text-transform: uppercase; color: #888; letter-spacing: 2px; margin-bottom: 8px;">Estado del Pedido</span>
      <strong style="font-size: 26px; color: ${info.color}; font-family: Arial, sans-serif;">
        ${info.estado.toUpperCase()}
      </strong>
    </div>

    <p style="text-align: center; color: #444; font-size: 15px; line-height: 1.5;">
      ${info.texto}
    </p>

    <div style="margin-top: 30px; padding: 20px; background-color: #fff3cd; border-radius: 5px; color: #856404; font-size: 14px;">
      <strong>Recuerda:</strong> 
      <p>Puedes revisar el estado de tu pedido en la sección <strong>Mis Pedidos</strong> dentro de tu cuenta.</p>
    </div>

    <p style="margin-top: 40px; font-size: 12px; color: #aaaaaa; text-align: center; border-top: 1px dashed #eee; padding-top: 20px;">
      Este es un mensaje generado automáticamente por el sistema de gestión.
    </p>
  `;

  return getBaseLayout(content, `Actualización Pedido #ORD-${idPedido.padStart(4, '0')}`);
};