import { generateAccessToken, generateRefreshToken, hashToken } from "../utils/generate-token.util.js";
import bcrypt from 'bcryptjs';
import db from '../models/index.js';
import RefreshToken from "../models/refresh-token.model.js";
import PasswordResetToken from "../models/reset-password.model.js";
import { compareOTP, generateOTP, hashOTP } from "../utils/otp.util.js";
import env from "../config/env.js";
import { sendEmailService } from "./email.service.js";
const { User } = db;

export async function registerService({ name, email, password }) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new Error('EMAIL_ALREADY_EXISTS');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        passwordHash,
        role: 'user',
    });

    return user;
}


export async function loginService({ email, password, ip, userAgent }) {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error('INVALID_CREDENTIALS');

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) throw new Error('INVALID_CREDENTIALS');


    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();
    const refreshTokenExpiresTime = new Date(Date.now() + env.REFRESH_EXPIRES_DAYS * 86400000);

    await RefreshToken.create({
        userId: user.id,
        tokenHash: hashToken(refreshToken),
        expiresAt: refreshTokenExpiresTime,
        ipAddress: ip,
        userAgent,
    });

    return {
        accessToken,
        refreshToken,
        refreshTokenExpiresTime,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
}




export async function refreshTokenService({ refreshToken, ip, userAgent }) {
    const tokenHash = hashToken(refreshToken);

    const storedToken = await RefreshToken.findOne({
        where: { tokenHash, revoked: false },
        include: [{ model: User, as: 'User' }],
    });

    if (!storedToken) throw new Error('INVALID_REFRESH');

    if (storedToken.expiresAt < new Date()) throw new Error('REFRESH_EXPIRED');

    const user = storedToken.User;

    if (!user) throw new Error('USER_NOT_FOUND');

    storedToken.revoked = true;
    await storedToken.save();

    // Generamos un nuevo refresh token
    const newRefreshTokenPlain = generateRefreshToken(); // PLANO
    const newRefreshTokenHash = hashToken(newRefreshTokenPlain);
    const refreshTokenExpiresTime = new Date(Date.now() + env.REFRESH_EXPIRES_DAYS * 86400000);
    await RefreshToken.create({
        userId: user.id,
        tokenHash: newRefreshTokenHash,
        expiresAt: refreshTokenExpiresTime,
        ipAddress: ip,
        userAgent,
        replacedByTokenId: storedToken.id,
    });

    const accessToken = generateAccessToken(user);

    return {
        accessToken,
        newRefreshToken: newRefreshTokenPlain, // enviamos plano al cliente
        refreshTokenExpiresTime,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
}


/**
 * Actualiza un usuario. Todos los campos son opcionales.
 * Si se envía `password`, se hash antes de guardar.
 * @param {Object} params
 * @param {number} params.userId - ID del usuario a modificar
 * @param {string} [params.name] - Nombre opcional
 * @param {string} [params.email] - Email opcional
 * @param {string} [params.password] - Contraseña opcional
 * @param {string} [params.role] - Rol opcional
 * @returns {Promise<Object>} - Usuario actualizado (sin password)
 */
export async function updateUserService({ id, name, password }) {
    const user = await User.findByPk(id);
    if (!user) throw new Error('USER_NOT_FOUND');

    // Preparar objeto con campos a actualizar
    const updates = {};
    if (name) updates.name = name;
    if (password) {
        updates.passwordHash = await bcrypt.hash(password, 10);
    }

    await user.update(updates);

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
}


export async function recoverPasswordService(email) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
        throw new Error('USER_NOT_FOUND');
    }

    await PasswordResetToken.update(
        { used: true },
        { where: { userId: user.id, used: false } }
    );

    const otp = generateOTP();
    const otpHash = await hashOTP(otp);

    await PasswordResetToken.create({
        userId: user.id,
        tokenHash: otpHash,
        expiresAt: new Date(Date.now() + Number(env.OTP_EXPIRES_MINUTES) * 60 * 1000),
    });

    await sendEmailService({
        email: user.email,
        subject: 'Código de recuperación',
        text: `Tu código OTP es: ${otp}`,
        html: `<p>Tu código OTP es <b>${otp}</b></p>`,
    });

    return true;
}





export async function resetPasswordService({ email, otp, newPassword }) {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error('INVALID_REQUEST');

    const resetToken = await PasswordResetToken.findOne({
        where: {
            userId: user.id,
            used: false,
        },
        order: [['createdAt', 'DESC']],
    });

    if (!resetToken) throw new Error('INVALID_OTP');

    if (resetToken.expiresAt < new Date()) {
        throw new Error('OTP_EXPIRED');
    }

    const isValid = await compareOTP(otp, resetToken.tokenHash);
    if (!isValid) throw new Error('INVALID_OTP');

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await user.update({ passwordHash });

    resetToken.used = true;
    await resetToken.save();

    return true;
}
