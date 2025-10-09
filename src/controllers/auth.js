import { registerUser as registerUserService, loginUser as loginUserService, refreshSession as refreshSessionService, logoutSession as logoutSessionService, sendResetEmail as sendResetEmailService, resetPassword as resetPasswordService } from '../services/auth.js';

// Контролер для реєстрації користувача
export const registerUser = async (req, res) => {
  // Отримуємо дані з тіла запиту
  const { name, email, password } = req.body;

  // Викликаємо сервіс для реєстрації
  const newUser = await registerUserService({ name, email, password });

  // Повертаємо успішну відповідь зі статусом 201
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: newUser,
  });
};

// Контролер для логіну користувача
export const loginUser = async (req, res) => {
  // Отримуємо дані з тіла запиту
  const { email, password } = req.body;

  // Викликаємо сервіс для логіну
  const loginResult = await loginUserService({ email, password });

  // Встановлюємо refresh token в cookies
  res.cookie('refreshToken', loginResult.refreshToken, {
    httpOnly: true, // Cookie недоступний через JavaScript (безпека)
    secure: process.env.NODE_ENV === 'production', // HTTPS тільки в продакшені
    sameSite: 'strict', // Захист від CSRF атак
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 днів в мілісекундах
  });

  // Повертаємо успішну відповідь зі статусом 200
  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: loginResult.accessToken,
    },
  });
};

// Контролер для оновлення сесії
export const refreshSession = async (req, res) => {
  // Отримуємо refresh token з cookies
  const { refreshToken } = req.cookies;

  // Викликаємо сервіс для оновлення сесії
  const refreshResult = await refreshSessionService(refreshToken);

  // Встановлюємо новий refresh token в cookies
  res.cookie('refreshToken', refreshResult.refreshToken, {
    httpOnly: true, // Cookie недоступний через JavaScript (безпека)
    secure: process.env.NODE_ENV === 'production', // HTTPS тільки в продакшені
    sameSite: 'strict', // Захист від CSRF атак
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 днів в мілісекундах
  });

  // Повертаємо успішну відповідь зі статусом 200
  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: refreshResult.accessToken,
    },
  });
};

// Контролер для логауту користувача
export const logoutSession = async (req, res) => {
  // Отримуємо refresh token з cookies
  const { refreshToken } = req.cookies;

  // Викликаємо сервіс для логауту
  await logoutSessionService(refreshToken);

  // Очищаємо refresh token cookie
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  // Повертаємо успішну відповідь зі статусом 204 (No Content)
  res.status(204).send();
};

// Контролер для відправки email з посиланням для скидання паролю
export const sendResetEmail = async (req, res) => {
  // Отримуємо email з тіла запиту
  const { email } = req.body;

  // Викликаємо сервіс для відправки email
  await sendResetEmailService(email);

  // Повертаємо успішну відповідь зі статусом 200
  res.status(200).json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

// Контролер для скидання паролю
export const resetPassword = async (req, res) => {
  // Отримуємо токен та новий пароль з тіла запиту
  const { token, password } = req.body;

  // Викликаємо сервіс для скидання паролю
  await resetPasswordService(token, password);

  // Повертаємо успішну відповідь зі статусом 200
  res.status(200).json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};

