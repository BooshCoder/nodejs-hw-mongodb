import express from 'express';
import { registerUser, loginUser, refreshSession, logoutSession } from '../controllers/auth.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerUserSchema, loginUserSchema } from '../schemas/auth.js';

const router = express.Router();

// POST /auth/register - реєстрація нового користувача
router.post(
  '/register',
  validateBody(registerUserSchema), // Спочатку валідуємо тіло запиту
  ctrlWrapper(registerUser) // Потім викликаємо контролер (обгорнутий в ctrlWrapper для обробки помилок)
);

// POST /auth/login - логін користувача
router.post(
  '/login',
  validateBody(loginUserSchema), // Спочатку валідуємо тіло запиту
  ctrlWrapper(loginUser) // Потім викликаємо контролер
);

// POST /auth/refresh - оновлення сесії
router.post(
  '/refresh',
  ctrlWrapper(refreshSession) // Викликаємо контролер (без валідації body, бо дані в cookies)
);

// POST /auth/logout - логаут користувача
router.post(
  '/logout',
  ctrlWrapper(logoutSession) // Викликаємо контролер (без валідації body, бо дані в cookies)
);

export default router;

