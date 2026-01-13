
import app from './app.js';
import env from './config/env.js';
import db from './models/index.js';

const startServer = async () => {
  try {
    await db.sequelize.sync();
    console.log('DB conectada');

    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });
  } catch (err) {
    console.error('Error al iniciar server:', err);
  }
};

startServer();
