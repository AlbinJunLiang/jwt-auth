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

describe('register->login->refresh validation test', () => {


    beforeAll(async () => {
    });
    beforeEach(async () => {
        try {
            await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
            await sequelize.models.RefreshToken.destroy({ where: {}, force: true });
            await sequelize.models.User.destroy({ where: {}, force: true });
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
    test('register->login->refresh  (INTEGRATION)', async () => {
        const registerRes = await request(app)
            .post('/api/v1/auth/register')
            .send({
                name: 'Test',
                email: 'test@testing3.com',
                password: '12345678',
            });
        expect(registerRes.status).toBe(201);
        expect(registerRes.body.message).toBe('Usuario creado correctamente');

        const loginRes = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'test@testing3.com',
                password: '12345678',
            });

        expect(loginRes.status).toBe(200);
        expect(loginRes.body).toHaveProperty('accessToken');



        const accessRes = await request(app)
            .post('/api/v1/auth/refresh')
            .set('Cookie', `refresh_token=${loginRes.body.refreshToken}`)

        expect(accessRes.status).toBe(200);
        expect(accessRes.body).toHaveProperty('accessToken');
    });











    test('register->login-> con refreh token no válido  (INTEGRATION)', async () => {
        const registerRes = await request(app)
            .post('/api/v1/auth/register')
            .send({
                name: 'Test',
                email: 'test@testing3.com',
                password: '12345678',
            });
        expect(registerRes.status).toBe(201);
        expect(registerRes.body.message).toBe('Usuario creado correctamente');

        const loginRes = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'test@testing3.com',
                password: '12345678',
            });

        expect(loginRes.status).toBe(200);
        expect(loginRes.body).toHaveProperty('accessToken');


        const expiredToken = "EXPIRADO=0692f4bc37630d04785eac6dae75918d00d26def52e6072b396c0578de95959fbf7d0cb3135e93687f20cfbac9fac29aced374552e143e10b057bcf19d7d77aa";
        const accessRes = await request(app)
            .post('/api/v1/auth/refresh')
            .set('Cookie', `refresh_token=${expiredToken}`)
        expect(accessRes.status).toBe(401);
        expect(accessRes.body.message).toBe('Refresh inválido');



    });
});
