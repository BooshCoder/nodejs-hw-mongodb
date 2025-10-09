import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { sendEmail } from '../utils/sendEmail.js';

// Функція для реєстрації нового користувача
export const registerUser = async (userData) => {
  try {
    const { name, email, password } = userData;

    // Перевіряємо, чи існує користувач з таким email
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      // Якщо користувач з таким email вже є - повертаємо помилку 409
      throw createHttpError(409, 'Email in use');
    }

    // Хешуємо пароль
    // 10 - це "salt rounds" (кількість раундів хешування)
    // Чим більше число - тим безпечніше, але повільніше
    const hashedPassword = await bcrypt.hash(password, 10);

    // Створюємо нового користувача з захешованим паролем
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Повертаємо користувача БЕЗ пароля
    // Використовуємо toObject() для конвертації Mongoose документа в звичайний об'єкт
    const userWithoutPassword = newUser.toObject();
    delete userWithoutPassword.password; // Видаляємо пароль з відповіді

    return userWithoutPassword;
  } catch (error) {
    // Якщо це наша помилка 409 - пробрасуємо її далі
    if (error.status === 409) {
      throw error;
    }
    // Інші помилки обгортаємо в загальну помилку
    throw new Error(`Failed to register user: ${error.message}`);
  }
};

// Функція для логіну користувача
export const loginUser = async (loginData) => {
  try {
    const { email, password } = loginData;

    // Шукаємо користувача за email
    const user = await User.findOne({ email });
    
    if (!user) {
      // Якщо користувача не знайдено - повертаємо помилку 401
      throw createHttpError(401, 'Email or password is wrong');
    }

    // Перевіряємо пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      // Якщо пароль не підходить - повертаємо помилку 401
      throw createHttpError(401, 'Email or password is wrong');
    }

    // Видаляємо старі сесії користувача
    await Session.deleteMany({ userId: user._id });

    // Генеруємо токени
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key', // В продакшені використовуйте змінну оточення
      { expiresIn: '15m' } // 15 хвилин
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
      { expiresIn: '30d' } // 30 днів
    );

    // Розраховуємо дати закінчення токенів
    const now = new Date();
    const accessTokenValidUntil = new Date(now.getTime() + 15 * 60 * 1000); // +15 хвилин
    const refreshTokenValidUntil = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // +30 днів

    // Створюємо нову сесію
    await Session.create({
      userId: user._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil,
      refreshTokenValidUntil,
    });

    // Повертаємо дані для відповіді
    return {
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    };
  } catch (error) {
    // Якщо це наша помилка 401 - пробрасуємо її далі
    if (error.status === 401) {
      throw error;
    }
    // Інші помилки обгортаємо в загальну помилку
    throw new Error(`Failed to login user: ${error.message}`);
  }
};

// Функція для оновлення сесії через refresh token
export const refreshSession = async (refreshToken) => {
  try {
    if (!refreshToken) {
      throw createHttpError(401, 'Refresh token is required');
    }

    // Валідуємо refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key');
    } catch (error) {
      throw createHttpError(401, 'Invalid refresh token');
    }

    // Шукаємо сесію в базі даних
    const session = await Session.findOne({ 
      refreshToken,
      refreshTokenValidUntil: { $gt: new Date() } // Перевіряємо, що токен ще не закінчився
    });

    if (!session) {
      throw createHttpError(401, 'Invalid or expired refresh token');
    }

    // Шукаємо користувача
    const user = await User.findById(session.userId);
    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    // Видаляємо стару сесію
    await Session.findByIdAndDelete(session._id);

    // Генеруємо нові токени
    const newAccessToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '15m' } // 15 хвилин
    );

    const newRefreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
      { expiresIn: '30d' } // 30 днів
    );

    // Розраховуємо дати закінчення нових токенів
    const now = new Date();
    const accessTokenValidUntil = new Date(now.getTime() + 15 * 60 * 1000); // +15 хвилин
    const refreshTokenValidUntil = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // +30 днів

    // Створюємо нову сесію
    await Session.create({
      userId: user._id,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenValidUntil,
      refreshTokenValidUntil,
    });

    // Повертаємо дані для відповіді
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    // Якщо це наша помилка 401 - пробрасуємо її далі
    if (error.status === 401) {
      throw error;
    }
    // Інші помилки обгортаємо в загальну помилку
    throw new Error(`Failed to refresh session: ${error.message}`);
  }
};

// Функція для логауту користувача
export const logoutSession = async (refreshToken) => {
  try {
    if (!refreshToken) {
      throw createHttpError(401, 'Refresh token is required');
    }

    // Шукаємо сесію в базі даних
    const session = await Session.findOne({ refreshToken });

    if (session) {
      // Видаляємо сесію
      await Session.findByIdAndDelete(session._id);
    }

    // Повертаємо успіх (навіть якщо сесія не знайдена)
    return { success: true };
  } catch (error) {
    // Якщо це наша помилка 401 - пробрасуємо її далі
    if (error.status === 401) {
      throw error;
    }
    // Інші помилки обгортаємо в загальну помилку
    throw new Error(`Failed to logout session: ${error.message}`);
  }
};

// Функція для відправки email з посиланням для скидання паролю
export const sendResetEmail = async (email) => {
  try {
    // Шукаємо користувача за email
    const user = await User.findOne({ email });

    if (!user) {
      // Якщо користувача не знайдено - повертаємо помилку 404
      throw createHttpError(404, 'User not found!');
    }

    // Генеруємо JWT токен з email користувача
    // Токен буде дійсний протягом 5 хвилин
    const resetToken = jwt.sign(
      { email: user.email }, // Payload - email користувача
      process.env.JWT_SECRET, // Секретний ключ для підпису
      { expiresIn: '5m' } // Термін життя токену - 5 хвилин
    );

    // Формуємо посилання для скидання паролю
    // Приклад: https://your-frontend-domain.com/reset-password?token=eyJhbGciOi...
    const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${resetToken}`;

    // HTML шаблон для листа
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hello,</p>
        <p>You requested to reset your password. Click the button below to proceed:</p>
        <div style="margin: 30px 0;">
          <a href="${resetLink}" 
             style="background-color: #007bff; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #666; word-break: break-all;">${resetLink}</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          This link will expire in 5 minutes. If you didn't request this, please ignore this email.
        </p>
      </div>
    `;

    // Текстова версія листа (для email клієнтів без HTML)
    const textContent = `
      Password Reset Request
      
      Hello,
      
      You requested to reset your password. Use the link below to proceed:
      ${resetLink}
      
      This link will expire in 5 minutes. If you didn't request this, please ignore this email.
    `;

    // Відправляємо email
    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        html: htmlContent,
        text: textContent,
      });
    } catch (emailError) {
      // Якщо не вдалося відправити email - повертаємо помилку 500
      console.error('Email sending error:', emailError);
      throw createHttpError(500, 'Failed to send the email, please try again later.');
    }

    // Повертаємо успіх
    return { success: true };
  } catch (error) {
    // Якщо це наша помилка (404 або 500) - пробрасуємо її далі
    if (error.status === 404 || error.status === 500) {
      throw error;
    }
    // Інші помилки обгортаємо в загальну помилку
    throw new Error(`Failed to send reset email: ${error.message}`);
  }
};

// Функція для скидання паролю
export const resetPassword = async (token, newPassword) => {
  try {
    // Крок 1: Валідуємо та декодуємо JWT токен
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      // Якщо токен невалідний або протермінований
      // jwt.verify викине помилку з типом:
      // - TokenExpiredError (якщо протермінований)
      // - JsonWebTokenError (якщо пошкоджений)
      throw createHttpError(401, 'Token is expired or invalid.');
    }

    // Крок 2: Отримуємо email з токену
    const { email } = decoded;

    if (!email) {
      // Якщо в токені немає email - токен пошкоджений
      throw createHttpError(401, 'Token is expired or invalid.');
    }

    // Крок 3: Шукаємо користувача в базі даних
    const user = await User.findOne({ email });

    if (!user) {
      // Якщо користувача не знайдено - повертаємо помилку 404
      throw createHttpError(404, 'User not found!');
    }

    // Крок 4: Хешуємо новий пароль
    // Використовуємо bcrypt з 10 раундами хешування
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Крок 5: Оновлюємо пароль користувача в базі даних
    user.password = hashedPassword;
    await user.save();

    // Крок 6: Видаляємо всі сесії цього користувача
    // Це змусить користувача залогінитись заново з новим паролем
    // Також це безпечніше - якщо хтось отримав доступ до акаунту,
    // після зміни паролю всі його сесії будуть недійсними
    await Session.deleteMany({ userId: user._id });

    // Повертаємо успіх
    return { success: true };
  } catch (error) {
    // Якщо це наша помилка (401 або 404) - пробрасуємо її далі
    if (error.status === 401 || error.status === 404) {
      throw error;
    }
    // Інші помилки обгортаємо в загальну помилку
    throw new Error(`Failed to reset password: ${error.message}`);
  }
};

