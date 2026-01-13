import transporter from "../config/email-transporter.config.js";
import env from "../config/env.js";

export const sendEmailService = async ({ email, subject, text, html }) => {
    const formato = {
        from: env.SMTP_USER_EMAIL,
        to: email,
        subject,
        text,
        html,
    };

    const info = await transporter.sendMail(formato);

    return info;
};
