import { getBaseLayout } from './base-layout';

/**
 * Genera el HTML para el correo de recuperación de contraseña.
 * @param nombre nombre del usuario para personalizar el saludo.
 * @param enlace URL completa con el token para resetear la clave (ej: http://frontend.com/reset?token=abc)
 */
export const getResetPasswordTemplate = (nombre: string, enlace: string) => {
  const content = `
    <p>Hola <strong>${nombre.split(" ")[0]}</strong>,</p>
    <p>Has recibido este correo porque se solicitó un cambio de contraseña para tu cuenta en nuestro sistema.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${enlace}" class="btn" style="color: white;">Restablecer mi contraseña</a>
    </div>

    <p style="font-size: 14px; color: #666;">
      Este enlace de recuperación expirará en 15 minutos. Si el botón no funciona, puedes copiar y pegar el siguiente enlace en tu navegador:
    </p>
    <p style="font-size: 12px; word-break: break-all; color: #0d6efd;">
      ${enlace}
    </p>

    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
    
    <p style="font-size: 13px; color: #999;">
      <strong>¿No solicitaste este cambio?</strong><br>
      Si tú no realizaste esta petición, puedes ignorar este correo de forma segura. Tu contraseña seguirá siendo la misma.
    </p>
  `;

  return getBaseLayout(content, 'Recuperación de Contraseña');
};