import { getBaseLayout } from './base-layout';

interface ItemPedido {
  nombre: string;
  cantidad: number;
  precio: number;
}

interface DatosPedido {
  id_pedido: string | number;
  usuario_nombre: string;
  productos: ItemPedido[];
  total: number;
}

export const getConfirmacionPedidoTemplate = (data: DatosPedido) => {
  // Generamos las filas de la tabla dinámicamente
  const filasProductos = data.productos.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.nombre}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.cantidad}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.precio.toLocaleString('es-CL')}</td>
    </tr>
  `).join('');

  const content = `
    <p>¡Hola <strong>${data.usuario_nombre}</strong>!</p>
    <p>Gracias por tu compra. Hemos recibido tu pedido <strong>#${data.id_pedido}</strong> y ya estamos trabajando en él.</p>
    
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
          <td colspan="2" style="padding: 20px 10px 10px; text-align: right; font-weight: bold;">Total Pagado:</td>
          <td style="padding: 20px 10px 10px; text-align: right; font-weight: bold; color: #0d6efd; font-size: 18px;">
            $${data.total.toLocaleString('es-CL')}
          </td>
        </tr>
      </tfoot>
    </table>

    <div style="margin-top: 30px; padding: 20px; background-color: #fff3cd; border-radius: 5px; color: #856404; font-size: 14px;">
      <strong>Información importante:</strong> Te avisaremos por este mismo medio cuando tu pedido esté en camino.
    </div>
  `;

  return getBaseLayout(content, 'Confirmación de Pedido');
};