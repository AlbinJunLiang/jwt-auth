import nodemailer from 'nodemailer';
import env from './env.js';

// Creamos el transporte una sola vez y lo reutilizamos
let transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: true,
    auth: {
        user: env.SMTP_USER_EMAIL,
        pass: env.SMTP_PASS,
    }
}
);

// Verificación de conexión (opcional pero útil al arrancar)
if (env.NODE_ENV !== 'test') {
    transporter.verify().then(() => {
        console.log('SMTP Server listo para enviar correos');
    }).catch((err) => {
        console.error('Error en configuración SMTP:', err);
    });

} else {
    transporter = null;
}

export default transporter;