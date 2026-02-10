import { DetallePedidoDTO } from '@/dtos/pedido.dto';
import { getBaseLayout } from './base-layout';

interface DatosPedido {
  id_pedido: string | number;
  usuario_nombre: string;
  productos: DetallePedidoDTO[];
  total: number;
}

export const getConfirmacionPedidoTemplate = (data: DatosPedido) => {
  // Generamos las filas de la tabla dinámicamente
  const filasProductos = data.productos.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.nombre}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.cantidad}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.precio_unitario.toLocaleString('es-CL')}</td>
    </tr>
  `).join('');

  const content = `
    <p>¡Hola <strong>${data.usuario_nombre.split(" ")[0]}</strong>!</p>
    <p>Gracias por tu compra. Hemos recibido tu pedido <strong>#ORD-${ data.id_pedido.toString().padStart(4, '0') }</strong> y ya estamos trabajando en él.</p>
    
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <thead>
        <tr style="background-color: #f8f9fa;">
          <th style="padding: 10px; text-align: left;">Producto</th>
          <th style="padding: 10px; text-align: center;">Cant.</th>
          <th style="padding: 10px; text-align: right;">Precio</th>
        </tr>
      </thead>
      <tbody>
        ${filasProductos}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2" style="padding: 20px 10px 10px; text-align: right; font-weight: bold;">Total a pagar:</td>
          <td style="padding: 20px 10px 10px; text-align: right; font-weight: bold; color: #0d6efd; font-size: 18px;">
            $${data.total.toLocaleString('es-CL')}
          </td>
        </tr>
      </tfoot>
    </table>

    <div style="margin-top: 30px; padding: 20px; background-color: #fff3cd; border-radius: 5px; color: #856404; font-size: 14px;">
      <strong>Información importante:</strong> 
      <p>Te avisaremos por este mismo medio cuando tu pedido esté listo para retirar.</p>
      <p>El resto del total del pedido se pagará en caja de forma presencial antes del retiro.</p>
    </div>

    <div style="margin-top: 20px; padding: 15px; background-color: #e9f7ef; border-radius: 5px; color: #155724; font-size: 13px;">
      Además, podrás revisar el estado de tu pedido en la sección <strong>Mis Pedidos</strong> dentro de tu cuenta.
    </div>

    <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px; color: #333; font-size: 13px;">
      <p><strong>Dirección:</strong> Av. Argentina #334, Valparaíso</p>
      <p><strong>Horario de atención:</strong><br>
        Lunes a viernes: 9:00 a 19:15 hrs<br>
        Sábado: 10:00 a 17:45 hrs
        </p>
    </div>
  `;

  return getBaseLayout(content, 'Confirmación de Pedido');
};