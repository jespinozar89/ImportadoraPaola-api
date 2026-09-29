
import { DetallePedidoDTO, TipoEntrega } from '../dtos/pedido.dto';
import { getBaseLayout } from './base-layout';

interface DatosPedido {
  id_pedido: string | number;
  usuario_nombre: string;
  productos: DetallePedidoDTO[];
  tipo_entrega: TipoEntrega;
  subtotal: number;
  costo_envio: number;
  total: number;
  direccion_envio?: string;
}

export const getConfirmacionPedidoTemplate = (data: DatosPedido) => {
  const esDespacho = data.tipo_entrega === TipoEntrega.despacho;

  const filasProductos = data.productos.map(item => {
    const tieneOferta = item.precio_unitario_oferta != null && item.precio_unitario_oferta > 0;
    const precioEfectivo = tieneOferta ? item.precio_unitario_oferta! : item.precio_unitario;
    const subtotalItem = precioEfectivo * item.cantidad;

    return `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: left;">
          ${item.nombre}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          ${tieneOferta
            ? `<span style="text-decoration: line-through; color: #888; font-size: 12px; display: block;">$${item.precio_unitario.toLocaleString('es-CL')}</span>                <strong style="color: #e53e3e;">$${item.precio_unitario_oferta!.toLocaleString('es-CL')}</strong>`
            : `$${item.precio_unitario.toLocaleString('es-CL')}`
          }
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
          ${item.cantidad}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">
          $${subtotalItem.toLocaleString('es-CL')}
        </td>
      </tr>
    `;
  }).join('');

  const resumenTotalesHtml = `
    <tr>
      <td colspan="3" style="padding: 10px 10px 5px; text-align: right; color: #555;">Subtotal productos:</td>
      <td style="padding: 10px 10px 5px; text-align: right; font-weight: bold;">
        $${data.subtotal.toLocaleString('es-CL')}
      </td>
    </tr>
    <tr>
      <td colspan="3" style="padding: 5px 10px; text-align: right; color: #555;">Envío:</td>
      <td style="padding: 5px 10px; text-align: right; font-weight: bold;">
        ${esDespacho ? `$${data.costo_envio.toLocaleString('es-CL')}` : '<span style="color: #28a745;">Gratis (Retiro)</span>'}
      </td>
    </tr>
    <tr>
      <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold; border-top: 1px solid #ddd;">Total pagado:</td>
      <td style="padding: 10px; text-align: right; font-weight: bold; color: #0d6efd; font-size: 18px; border-top: 1px solid #ddd;">
        $${data.total.toLocaleString('es-CL')}
      </td>
    </tr>
  `;

  const detalleEntregaHtml = esDespacho
    ? `
      <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px; color: #333; font-size: 13px;">
        <p style="margin: 0 0 5px 0;"><strong>Tipo de Entrega:</strong> Despacho a Domicilio</p>
        <p style="margin: 0;"><strong>Dirección de Envío:</strong> ${data.direccion_envio}</p>
      </div>
    `
    : `
      <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px; color: #333; font-size: 13px;">
        <p style="margin: 0 0 5px 0;"><strong>Tipo de Entrega:</strong> Retiro en Tienda</p>
        <p style="margin: 0 0 5px 0;"><strong>Dirección de Retiro:</strong> Av. Argentina #334, Valparaíso</p>
        <p style="margin: 0;"><strong>Horario de atención:</strong><br>
          Lunes a viernes: 9:00 a 19:15 hrs<br>
          Sábado: 10:00 a 17:45 hrs
        </p>
      </div>
    `;

  const content = `
    <p>¡Hola <strong>${data.usuario_nombre.split(" ")[0]}</strong>!</p>
    <p>Gracias por tu compra. Hemos recibido tu pedido <strong>#ORD-${data.id_pedido.toString().padStart(4, '0')}</strong> y ya estamos trabajando en él.</p>
    
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <thead>
        <tr style="background-color: #f8f9fa;">
          <th style="padding: 10px; text-align: left;">Producto</th>
          <th style="padding: 10px; text-align: right;">Precio</th>
          <th style="padding: 10px; text-align: center;">Cant.</th>
          <th style="padding: 10px; text-align: right;">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${filasProductos}
      </tbody>
      <tfoot>
        ${resumenTotalesHtml}
      </tfoot>
    </table>

    <div style="margin-top: 30px; padding: 20px; background-color: #fff3cd; border-radius: 5px; color: #856404; font-size: 14px;">
      <strong>Información importante:</strong> 
      <p style="margin-top: 5px;">
        ${esDespacho 
          ? 'Te enviaremos una notificación por correo cuando tu pedido haya sido despachado.' 
          : 'Te avisaremos por este mismo medio cuando tu pedido esté listo para retirar en tienda.'}
      </p>
    </div>

    <div style="margin-top: 20px; padding: 15px; background-color: #e9f7ef; border-radius: 5px; color: #155724; font-size: 13px;">
      Además, podrás revisar el estado de tu pedido en la sección <strong>Mis Pedidos</strong> dentro de tu cuenta.
    </div>

    ${detalleEntregaHtml}
  `;

  return getBaseLayout(content, 'Confirmación de Pedido');
};