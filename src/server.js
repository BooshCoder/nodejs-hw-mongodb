import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import pino from 'pino';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import contactsRoutes from './routers/contacts.js';
import authRoutes from './routers/auth.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';

// Отримуємо шлях до поточної директорії (для ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Завантажуємо Swagger документацію
const swaggerDocument = JSON.parse(
  readFileSync(join(__dirname, '../docs/swagger.json'), 'utf-8')
);

const logger = pino();

export const setupServer = () => {
  // Створення серверу за допомогою виклику express()
  const app = express();

  // Налаштування cors та логгера pino
  app.use(cors());
  app.use(express.json());
  app.use(cookieParser()); // Middleware для парсингу cookies

  // Логгер middleware
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });

  // Роути
  app.use('/contacts', contactsRoutes);
  app.use('/auth', authRoutes);

  // Swagger документація
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
