import { jest } from '@jest/globals';

/* ===============================
   MOCKS
   =============================== */

jest.unstable_mockModule('bcryptjs', () => ({
  default: {
    hash: jest.fn(),
  }
}));

jest.unstable_mockModule('../../src/models/index.js', () => ({
  default: {
    User: {
      findOne: jest.fn(),
      create: jest.fn(),
    }
  }
}));

jest.unstable_mockModule(
  '../../src/config/email-transporter.config.js',
  () => ({
    default: {
      sendMail: jest.fn(),
      verify: jest.fn().mockResolvedValue(true),
    }
  })
);

/* ===============================
   IMPORTS DINÁMICOS
   =============================== */

const bcrypt = (await import('bcryptjs')).default;
const db = (await import('../../src/models/index.js')).default;
const { registerService } = await import('../../src/services/auth.service.js');

const { User } = db;

/* ===============================
   TESTS
   =============================== */

describe('registerService', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('lanza error si el email ya existe', async () => {
    User.findOne.mockResolvedValue({ id: 1 });

    await expect(
      registerService({
        name: 'Test',
        email: 'test@test.com',
        password: '123'
      })
    ).rejects.toThrow('EMAIL_ALREADY_EXISTS');
  });


  
test('crea usuario si el email no existe', async () => {
  User.findOne.mockResolvedValue(null);
  bcrypt.hash.mockResolvedValue('hashed');
  User.create.mockResolvedValue({
    id: 1,
    name: 'Test',
    email: 'test@test.com',
    role: 'user',
  });

  const result = await registerService({
    name: 'Test',
    email: 'test@test.com',
    password: '123'
  });

  expect(result.id).toBe(1);
});




test('lanza error si el email ya existe', async () => {
  //  Simulamos que la DB encuentra el usuario
  User.findOne.mockResolvedValue({
    id: 1,
    email: 'tesdsfsdft@test.com',
  });

  //  Ejecutamos y esperamos error
  await expect(
    registerService({
      name: 'Test',
      email: 'test@test.com',
      password: '123'
    })
  ).rejects.toThrow('EMAIL_ALREADY_EXISTS');

  //  Verificamos que se validó el email
  expect(User.findOne).toHaveBeenCalledWith({
    where: { email: 'test@test.com' }
  });

  //  MUY IMPORTANTE: NO debe crear ni hashear
  expect(User.create).not.toHaveBeenCalled();
  expect(bcrypt.hash).not.toHaveBeenCalled();
});


});




