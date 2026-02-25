import { getBaseLayout } from './base-layout';

/**
 * @param nombre Nombre del usuario que actualizó sus datos
 * @param fecha Hora y fecha de la actualización (opcional)
 */
export const getUpdateDatosTemplate = (nombre: string, fecha: string = new Date().toLocaleString()) => {
  const content = `
    <div style="text-align: center; margin-bottom: 20px;">
      <div style="display: inline-block; background-color: #e8f5e9; color: #2e7d32; padding: 15px; border-radius: 50%; margin-bottom: 15px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
          <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.42-6.446z"/>
        </svg>
      </div>
      <h2 style="color: #333; margin: 0;">¡Perfil Actualizado!</h2>
    </div>

    <p>Hola <strong>${nombre.split(" ")[0]}</strong>,</p>
    <p>Te confirmamos que los datos personales de tu cuenta han sido modificados exitosamente en nuestro sistema.</p>
    
    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 25px 0; border: 1px solid #e9ecef;">
      <p style="margin: 0; font-size: 14px; color: #666;">
        <strong>Fecha de la actividad:</strong> ${fecha}<br>
        <strong>Estado:</strong> Completado con éxito
      </p>
    </div>

    <p>Si tú realizaste estos cambios, no necesitas hacer nada más. Si <strong>no reconoces</strong> esta actividad, te recomendamos cambiar tu contraseña de inmediato y contactar con nuestro equipo de soporte.</p>

    <div style="text-align: center; margin-top: 30px;">
      <a href="${process.env.BASE_URL}/" class="btn" style="color: white; font-weight: bold;">
        Revisar mi Perfil
      </a>
    </div>

    <p style="margin-top: 40px; font-size: 11px; color: #999; text-align: center; line-height: 1.4;">
      Por motivos de seguridad, no mostramos los datos específicos que han sido cambiados en este correo electrónico.
    </p>
  `;

  return getBaseLayout(content, 'Seguridad de la Cuenta');
};