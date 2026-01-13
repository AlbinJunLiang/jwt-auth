import { z } from 'zod';

export const resetPasswordSchema = z.object({
    email: z.email('Correo no válido'),
    otp: z.string().length(6, 'OTP debe tener 6 dígitos'),
    newPassword: z.string()
        .min(8, 'Mínimo 8 caracteres')
        .max(64),
});




export const registerSchema = z.object({
  email: z.email('Correo no válido'),
  name: z.string()
    .trim()
    .min(1, 'El nombre no puede estar vacío'),
  password: z.string()
    .min(8, 'Mínimo 8 caracteres')
    .max(64),
}).strict();
