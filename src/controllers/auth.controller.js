import { recoverPasswordService, loginService, refreshTokenService, registerService, updateUserService, resetPasswordService } from '../services/auth.service.js';

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const { accessToken, refreshToken, user, refreshTokenExpiresTime } = await loginService({
            email,
            password,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
        });

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({
            refreshToken,
            accessToken,
            refreshTokenExpiresTime: Math.floor(new Date(refreshTokenExpiresTime).getTime() / 1000),
            user,
        });

    } catch (error) {
        console.error('LOGIN ERROR', error);
        return res.status(401).json({
            message: 'Credenciales inválidas',
        });
    }
};


export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        await registerService({ name, email, password });

        const { accessToken, refreshToken, user, refreshTokenExpiresTime } = await loginService({
            email,
            password,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
        });

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        return res.status(201).json({
            message: 'Usuario creado correctamente',
            accessToken,
            refreshToken,
            refreshTokenExpiresTime: Math.floor(new Date(refreshTokenExpiresTime).getTime() / 1000),
            user,
        });

    } catch (error) {
        console.error('REGISTER ERROR', error);

        if (error.message === 'EMAIL_ALREADY_EXISTS') {
            return res.status(409).json({
                message: 'El email ya está registrado',
            });
        }

        return res.status(500).json({
            message: 'Error al registrar usuario',
        });
    }
};



export const refresh = async (req, res) => {
    try {
        let refreshToken = req.cookies.refresh_token;

        if (!refreshToken) refreshToken = req.headers['x-refresh-token'];

        if (!refreshToken) refreshToken = req.body.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: 'No refresh token provided' });
        }

        const { accessToken, newRefreshToken, user, refreshTokenExpiresTime } =
            await refreshTokenService({
                refreshToken,
                ip: req.ip,
                userAgent: req.headers['user-agent'],
            });

        // Guardamos la cookie de todos modos
        res.cookie('refresh_token', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        return res.json({
            refreshToken: newRefreshToken,
            refreshTokenExpiresTime: Math.floor(new Date(refreshTokenExpiresTime).getTime() / 1000)
            , accessToken, user
        });

    } catch (error) {
        console.error('REFRESH ERROR', error);
        return res.status(401).json({ message: 'Refresh inválido' });
    }
};


export const updateUser = async (req, res) => {
    try {
        const id = req.user.id;



        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: 'No se enviaron datos para actualizar' });
        }

        const { name, password } = req.body;

        const updatedUser = await updateUserService({
            id,
            name,
            password,
        });

        return res.json({
            message: 'Usuario actualizado correctamente',
            user: updatedUser,
        });
    } catch (error) {
        const status = error.message.includes('NOT_FOUND') ? 404 : 400;
        return res.status(status).json({ message: error.message });
    }
};


export const recoverPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                message: 'El email es obligatorio',
            });
        }
        await recoverPasswordService(email);

        return res.json({
            message: 'Si el correo existe, se envió un OTP',
        });

    } catch (error) {
        console.error('FORGOT PASSWORD ERROR', error);

        if (error.message === 'USER_NOT_FOUND') {
            return res.status(404).json({
                message: 'El usuario no existe',
            });
        }

        return res.status(500).json({
            message: 'Error interno',
        });
    }
};



export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        await resetPasswordService({ email, otp, newPassword });
        return res.json({
            message: 'Contraseña actualizada correctamente',
        });

    } catch (error) {
        console.error('RESET PASSWORD ERROR', error);
        return res.status(400).json({
            message: 'Código inválido o expirado',
        });
    }
};
