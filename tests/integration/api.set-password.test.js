// api.login.test.js
import request from 'supertest';
import app from '../../src/app.js';
import sequelize from '../../src/config/database.js';
import { jest } from '@jest/globals';

jest.mock('nodemailer', () => ({
    createTransport: () => ({
        sendMail: jest.fn(),
    }),
}));

describe('register->login->change password validation test', () => {


    beforeAll(async () => {
    });

    beforeEach(async () => {
        try {
            // 1. Apagamos los guardianes (Checks)
            await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

            // 2. Limpiamos los datos (Usamos destroy para evitar bloqueos de truncate)
            await sequelize.models.RefreshToken.destroy({ where: {}, force: true });
            await sequelize.models.User.destroy({ where: {}, force: true });

            // 3. Opcional: Reiniciar los contadores de ID para que el primer usuario siempre sea ID 1
            await sequelize.query('ALTER TABLE users AUTO_INCREMENT = 1');

        } catch (error) {
            console.error('Error limpiando la base de datos:', error);
        } finally {
            // 4. IMPORTANTE: Pase lo que pase, volvemos a encender los guardianes
            await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        }
    });

    afterAll(async () => {
        await sequelize.close();
    });
    test('register->login->change password  (INTEGRATION)', async () => {
        const registerRes = await request(app)
            .post('/api/v1/auth/register')
            .send({
                name: 'Test',
                email: 'test@testing4.com',
                password: '12345678',
            });
        expect(registerRes.status).toBe(201);
        expect(registerRes.body.message).toBe('Usuario creado correctamente');

        const loginRes = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'test@testing4.com',
                password: '12345678',
            });

        expect(loginRes.status).toBe(200);
        expect(loginRes.body).toHaveProperty('accessToken');




        const resetRes = await request(app)
            .put('/api/v1/auth')
            .set('authorization', `Bearer ${loginRes.body.accessToken}`)

            .send({
                email: 'test@testing4.com',
                password: '12345678',
                newPassword: '12345678NEW',
            });

        expect(resetRes.status).toBe(200);
        expect(resetRes.body.message).toBe("Usuario actualizado correctamente");
    });
});
