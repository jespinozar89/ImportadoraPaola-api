import { getBaseLayout } from './base-layout';

/**
 * @param nombreCliente Nombre del usuario
 * @param nuevoEstado Pendiente, Preparado, Listo, Entregado, Cancelado
 * @param idPedido El código o ID del pedido
 */
export const getEstadoPedidoTemplate = (nombreCliente: string, nuevoEstado: string, idPedido: string) => {
  
  // Configuración de estilos según el estado
  const config: any = {
    'Pendiente': { color: '#ffc107', texto: 'Tu pedido ha sido recibido y está en lista de espera.' },
    'Preparado': { color: '#0dcaf0', texto: '¡Buenas noticias! Estamos preparando tus productos.' },
    'Listo':     { color: '#6610f2', texto: 'Tu pedido ya está listo para ser retirado o despachado.' },
    'Entregado': { color: '#198754', texto: 'El pedido ha sido entregado. ¡Esperamos que lo disfrutes!' },
    'Cancelado': { color: '#dc3545', texto: 'El pedido ha sido cancelado. Si tienes dudas, contáctanos.' }
  };

  const info = config[nuevoEstado] || { color: '#0d6efd', texto: 'Tu pedido tiene una nueva actualización.' };

  const content = `
    <p>Hola <strong>${nombreCliente}</strong>,</p>
    <p>Queremos informarte que hay una actualización en el estado de tu pedido <strong>#${idPedido}</strong>.</p>
    
    <div style="margin: 30px 0; padding: 25px; border-radius: 10px; background-color: #fcfcfc; border: 1px solid #eeeeee; border-top: 5px solid ${info.color}; text-align: center;">
      <span style="display: block; font-size: 11px; text-transform: uppercase; color: #888; letter-spacing: 2px; margin-bottom: 8px;">Estado del Pedido</span>
      <strong style="font-size: 26px; color: ${info.color}; font-family: Arial, sans-serif;">
        ${nuevoEstado.toUpperCase()}
      </strong>
    </div>

    <p style="text-align: center; color: #444; font-size: 15px; line-height: 1.5;">
      ${info.texto}
    </p>

    <div style="text-align: center; margin-top: 35px;">
      <a href="http://tu-erp.com/seguimiento/${idPedido}" class="btn" style="color: white; font-weight: bold;">
        Seguir mi pedido
      </a>
    </div>

    <p style="margin-top: 40px; font-size: 12px; color: #aaaaaa; text-align: center; border-top: 1px dashed #eee; padding-top: 20px;">
      Este es un mensaje generado automáticamente por el sistema de gestión.
    </p>
  `;

  return getBaseLayout(content, `Actualización Pedido #${idPedido}`);
};