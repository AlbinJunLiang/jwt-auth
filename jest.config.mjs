// jest.config.mjs
export default {
  testEnvironment: "node",
  transform: {}, // evita que Jest intente usar Babel si no lo tienes
  testTimeout: 20000, // 20 segundos para todos los tests/hooks
};
