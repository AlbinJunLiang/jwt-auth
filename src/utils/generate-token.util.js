import { randomBytes, createHash } from 'crypto';

import jwt from 'jsonwebtoken';
import env from '../config/env.js';


const ACCESS_SECRET = env.JWT_SECRET;


export function generateAccessToken(user) {
    return jwt.sign(
        { id: user.id, role: user.role },
        ACCESS_SECRET,
        { expiresIn: env.ACCESS_EXPIRES }
    );
}

export function generateRefreshToken() {
    return randomBytes(64).toString("hex");
}

export function hashToken(token) {
    return createHash('sha256').update(token).digest('hex');
}