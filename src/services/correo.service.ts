import { getConfirmacionPedidoTemplate } from '../templates/pedido.template';
import { getResetPasswordTemplate } from '../templates/reset-password.template';
import { getEstadoPedidoTemplate } from '../templates/estado-pedido.template';
import { getUpdateDatosTemplate } from '../templates/actualizacion-datos-personales.template';
import { getBienvenidaTemplate } from '../templates/bienvenida.template';
import nodemailer from 'nodemailer';

export class CorreoService {
    // private ultimosEnvios: Map<string, number> = new Map();
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: true,
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        });
    }

    private async send(to: string, subject: string, html: string,archivoAdjuntoBase64?: { filename: string; content: string; contentType?: string }) {
        // const ahora = Date.now();
        // const ultimoEnvio = this.ultimosEnvios.get(to);

        // if (ultimoEnvio && ahora - ultimoEnvio < 30000) {
        //     throw new Error("No se puede reenviar correo al mismo destinatario dentro de 30 segundos.");
        // }

        try {
            await this.transporter.sendMail({
                from: `"Libreria Paola" <${process.env.SMTP_USER}>`,
                to, subject, html,
                bcc: process.env.SMTP_BCC ? [process.env.SMTP_BCC] : [],
                attachments: archivoAdjuntoBase64 
                ? [ 
                    { 
                        filename: archivoAdjuntoBase64.filename, 
                        content: archivoAdjuntoBase64.content, 
                        encoding: "base64", 
                        contentType: archivoAdjuntoBase64.contentType || "application/pdf" 
                    } 
                ] : []
            });
            // this.ultimosEnvios.set(to, ahora);
            return true;
        } catch (error) {
            console.error(`Error enviando email a ${to}:`, error);
            return false;
        }
    }

    // FLUJO 1: Confirmación de Pedido
    async enviarConfirmacionPedido(email: string, datos: any) {
        const html = getConfirmacionPedidoTemplate(datos);
        const idPedido = `#ORD-${datos.id_pedido.toString().padStart(4, '0')}`
        return this.send(
            email,
            `Confirmación de Pedido ${idPedido}`,
            html
        );
    }

    // FLUJO 2: Reset Password
    async enviarResetPassword(email: string, nombre: string, enlace: string) {
        const html = getResetPasswordTemplate(nombre, enlace);
        return this.send(email, 'Restablecer tu contraseña', html);
    }

    // FLUJO 3: Cambio de Estado (Listo, Entregado, etc.)
    async enviarCambioEstadoPedido(
        email: string,
        nombreCliente: string,
        nuevoEstado: string,
        idPedido: string,
        archivoAdjuntoBase64?: { filename: string; content: string; contentType: string;}
    ) {
        const html = getEstadoPedidoTemplate(nombreCliente, nuevoEstado, idPedido);
        const id_Pedido = `#ORD-${idPedido.toString().padStart(4, '0')}`;
        return this.send(
            email,
            `Tu pedido ${id_Pedido} ha cambiado a: ${nuevoEstado}`,
            html,
            archivoAdjuntoBase64
        );
    }

    // FLUJO 4: Actualización de Datos Personales
    async enviarNotificacionUpdateDatos(email: string, nombre: string) {
        const html = getUpdateDatosTemplate(nombre);
        return this.send(email, 'Actualización de perfil exitosa', html);
    }

    // FLUJO 5: Bienvenida nuevo usuario
    async enviarNotificacionBienvenida(email: string, nombre: string) {
        const html = getBienvenidaTemplate(nombre);
        return this.send(email, '¡Bienvenido a Librería Paola!', html);
    }
}