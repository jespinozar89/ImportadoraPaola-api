import { getBaseLayout } from './base-layout';

/**
 * Genera el HTML para el correo de bienvenida de un nuevo usuario en Librería Paola,
 * especializada en artículos escolares, de oficina y papelería.
 * @param nombre Nombre del usuario para personalizar el saludo.
 */
export const getBienvenidaTemplate = (nombre: string) => {
  const content = `
    <div style="text-align: center; margin-bottom: 20px;">
      <div style="display: inline-block; background-color: #e3f2fd; color: #1976d2; padding: 15px; border-radius: 50%; margin-bottom: 15px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
          <path d="M4 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zm1 2v10h6V3H5z"/>
        </svg>
      </div>
      <h2 style="color: #333; margin: 0;">¡Bienvenido a Librería Paola!</h2>
    </div>

    <p>Hola <strong>${nombre.split(" ")[0]}</strong>,</p>
    <p>Gracias por registrarte en <strong>Librería Paola</strong>. Aquí encontrarás todo lo que necesitas para tu día a día: artículos escolares, útiles de oficina, papelería y mucho más.</p>
    
    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 25px 0; border: 1px solid #e9ecef;">
      <p style="margin: 0; font-size: 14px; color: #666;">
        ✏️ Tu cuenta ha sido creada exitosamente.<br>
        📚 Explora nuestras colecciones y equípate con lo mejor para estudiar, trabajar o organizar tu hogar.
      </p>
    </div>

    <p>En Librería Paola siempre tenemos novedades y promociones especiales para estudiantes, profesionales y familias. Queremos acompañarte en cada proyecto y etapa de tu vida.</p>

    <div style="text-align: center; margin-top: 30px;">
      <a href="${process.env.BASE_URL}/" class="btn" style="color: white; font-weight: bold;">
        Explorar artículos escolares y de oficina
      </a>
    </div>

    <p style="margin-top: 40px; font-size: 11px; color: #999; text-align: center; line-height: 1.4;">
      Este correo se genera automáticamente al registrarte en Librería Paola. ¡Gracias por confiar en nosotros para tus útiles escolares y de oficina!
    </p>
  `;

  return getBaseLayout(content, 'Bienvenido a Librería Paola');
};
