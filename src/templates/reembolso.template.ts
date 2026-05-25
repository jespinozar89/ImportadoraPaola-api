import { getBaseLayout } from './base-layout';

/**
 * Genera el HTML para el correo de cancelación exitosa de una compra en Librería Paola.
 * Informa al cliente que su pedido fue cancelado y el tiempo estimado para su devolución.
 * @param nombre Nombre del cliente para personalizar el saludo.
 * @param idPedido El código o ID de la compra cancelada.
 */
export const getCancelacionCompraTemplate = (nombre: string, idPedido: string) => {
  const content = `
    <div style="text-align: center; margin-bottom: 20px;">
      <div style="display: inline-block; background-color: #fff3e0; color: #e65100; padding: 15px; border-radius: 50%; margin-bottom: 15px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
          <path d="M11.5 4a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0V6H7v4a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5h5z"/>
          <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l1.25 5h8.22l1.25-5H3.14z"/>
        </svg>
      </div>
      <h2 style="color: #333; margin: 0;">Cancelación Procesada Exitosamente</h2>
    </div>

    <p>Hola <strong>${nombre.split(" ")[0]}</strong>,</p>
    <p>Te informamos que la cancelación de tu compra asociada al pedido <strong>#ORD-${idPedido.padStart(4, '0')}</strong> en <strong>Librería Paola</strong> se ha realizado con éxito.</p>
    
    <div style="background-color: #fdf8e2; border-radius: 8px; padding: 20px; margin: 25px 0; border: 1px solid #f5e7b8;">
      <p style="margin: 0; font-size: 14px; color: #6d4c41; line-height: 1.5;">
        🛍️ <strong>Estado del Pedido:</strong> Cancelado.<br>
        ⏱️ <strong>Información de Devolución:</strong> El proceso de reembolso ha sido iniciado. Por favor, considera un plazo estimado de <strong>una semana (7 días hábiles)</strong> para que el dinero se vea reflejado en tu cuenta, dependiendo de tu entidad bancaria.
      </p>
    </div>

    <p>Lamentamos los inconvenientes que esto te pueda causar. Si tienes alguna duda sobre el estado de tu reembolso o deseas realizar un pedido diferente de artículos escolares o de oficina, nuestro equipo de soporte está disponible para ayudarte.</p>

    <p style="margin-top: 40px; font-size: 11px; color: #999; text-align: center; line-height: 1.4;">
      Este correo se genera automáticamente tras la cancelación de un pedido en Librería Paola. Si no solicitaste esta acción, por favor comunícate de inmediato con soporte.
    </p>
  `;

  return getBaseLayout(content, `Cancelación de Compra #${idPedido} - Librería Paola`);
};