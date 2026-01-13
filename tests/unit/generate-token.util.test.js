import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';

/* ===========================
   MOCK DEL ENV (ESM REAL)
   =========================== */
jest.unstable_mockModule('../../src/config/env.js', () => ({
    default: {
        JWT_SECRET: 'test-secret',
        ACCESS_EXPIRES: '1h',
    },
}));

/* ===========================
   IMPORTS DINÁMICOS
   =========================== */
const {
    generateAccessToken,
    generateRefreshToken,
    hashToken,
} = await import('../../src/utils/generate-token.util.js');

/* ===========================
   TESTS
   =========================== */
describe('Token utils', () => {

    test('generateAccessToken devuelve un JWT válido con id y role', () => {
        const user = { id: 1, role: 'user' };

        const token = generateAccessToken(user);

        expect(typeof token).toBe('string');

        const decoded = jwt.verify(token, 'test-secret');

        expect(decoded.id).toBe(1);
        expect(decoded.role).toBe('user');
    });


    test('Valida access token expirado', () => {

        const token = jwt.sign(
            { id: 7, role: 'user' },
            'test-secret',
            { expiresIn: '-201s' }
        );

        expect(() => {
            jwt.verify(token, 'test-secret');
        }).toThrow(jwt.TokenExpiredError);
    });

    test('generateRefreshToken genera tokens únicos y válidos', () => {
        const token1 = generateRefreshToken();
        const token2 = generateRefreshToken();

        expect(typeof token1).toBe('string');
        expect(token1).toHaveLength(128);
        expect(token1).not.toBe(token2);
    });

    test('hashToken devuelve siempre el mismo hash para el mismo token', () => {
        const token = 'refresh-token-test';

        const hash1 = hashToken(token);
        const hash2 = hashToken(token);

        expect(hash1).toBe(hash2);
        expect(hash1).toHaveLength(64);
    });

    test('hashToken genera hashes distintos para tokens distintos', () => {
        const hash1 = hashToken('token-1');
        const hash2 = hashToken('token-2');

        expect(hash1).not.toBe(hash2);
    });
});
