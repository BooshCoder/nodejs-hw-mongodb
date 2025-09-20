import express from 'express';
import cors from 'cors';
import pino from 'pino';
import contactsRoutes from './routers/contacts.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';

const logger = pino();

export const setupServer = () => {
  // Створення серверу за допомогою виклику express()
  const app = express();

  // Налаштування cors та логгера pino
  app.use(cors());
  app.use(express.json());

  // Логгер middleware
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });

  // Роути
  app.use('/contacts', contactsRoutes);

  // Обробка неіснуючих роутів
  app.use(notFoundHandler);

  // Обробка помилок
  app.use(errorHandler);

  // Запуск серверу на порті, вказаному через змінну оточення PORT або 3000
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    // При вдалому запуску сервера виводити в консоль рядок
    console.log(`Server is running on port ${PORT}`);
  });

  return app;
};
