import { getConfirmacionPedidoTemplate } from '../templates/pedido.template';
import { getResetPasswordTemplate } from '../templates/reset-password.template';
import { getEstadoPedidoTemplate } from '../templates/estado-pedido.template';
import { getUpdateDatosTemplate } from '../templates/actualizacion-datos-personales.template';
import nodemailer from 'nodemailer';

export class CorreoService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: true,
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        });
    }

    // Método privado genérico para no repetir código de envío
    private async send(to: string, subject: string, html: string) {
        try {
            await this.transporter.sendMail({
                from: `"Sistema ERP" <${process.env.SMTP_USER}>`,
                to, subject, html
            });
            return true;
        } catch (error) {
            console.error(`Error enviando email a ${to}:`, error);
            return false;
        }
    }

    // FLUJO 1: Confirmación de Pedido
    async enviarConfirmacionPedido(email: string, datos: any) {
        const html = getConfirmacionPedidoTemplate(datos);
        return this.send(email, `Confirmación de Pedido #${datos.id_pedido}`, html);
    }

    // FLUJO 2: Reset Password
    async enviarResetPassword(email: string, nombre: string, enlace: string) {
        const html = getResetPasswordTemplate(nombre, enlace);
        return this.send(email, 'Restablecer tu contraseña', html);
    }

    // FLUJO 3: Cambio de Estado (Pendiente, Entregado, etc.)
    async enviarCambioEstadoPedido(
        email: string,
        nombreCliente: string,
        nuevoEstado: string,
        idPedido: string
    ) {
        const html = getEstadoPedidoTemplate(nombreCliente, nuevoEstado, idPedido);
        return this.send(email, `Tu pedido #${idPedido} ha cambiado a: ${nuevoEstado}`, html);
    }

    // FLUJO 4: Actualización de Datos Personales
    async enviarNotificacionUpdateDatos(email: string, nombre: string) {
        const html = getUpdateDatosTemplate(nombre);
        return this.send(email, 'Actualización de perfil exitosa', html);
    }
}