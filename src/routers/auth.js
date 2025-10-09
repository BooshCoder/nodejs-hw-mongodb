import express from 'express';
import { registerUser, loginUser, refreshSession, logoutSession, sendResetEmail, resetPassword } from '../controllers/auth.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerUserSchema, loginUserSchema, sendResetEmailSchema, resetPasswordSchema } from '../schemas/auth.js';

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

// POST /auth/send-reset-email - відправка email для скидання паролю
router.post(
  '/send-reset-email',
  validateBody(sendResetEmailSchema), // Спочатку валідуємо тіло запиту (перевіряємо email)
  ctrlWrapper(sendResetEmail) // Потім викликаємо контролер
);

// POST /auth/reset-pwd - скидання паролю за токеном
router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema), // Спочатку валідуємо тіло запиту (token та password)
  ctrlWrapper(resetPassword) // Потім викликаємо контролер
);

export default router;

