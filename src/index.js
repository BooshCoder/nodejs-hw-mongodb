import 'dotenv/config';

import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

// Спочатку підключаємося до MongoDB, потім запускаємо сервер
const startApp = async () => {
  await initMongoConnection();
  setupServer();
};

startApp();