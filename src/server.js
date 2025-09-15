import express from 'express';
import cors from 'cors';
import pino from 'pino';
import contactsRoutes from './routes/contactsRoutes.js';

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

  // Обробка неіснуючих роутів (повертає статус 404 і відповідне повідомлення)
  app.use((req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  // Запуск серверу на порті, вказаному через змінну оточення PORT або 3000
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    // При вдалому запуску сервера виводити в консоль рядок
    console.log(`Server is running on port ${PORT}`);
  });

  return app;
};
