import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { User } from '../models/user.js';

// Middleware для авторизації користувача
export const authenticate = async (req, res, next) => {
  try {
    // Отримуємо заголовок Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw createHttpError(401, 'Authorization header is required');
    }

    // Перевіряємо формат "Bearer <token>"
    const [bearer, token] = authHeader.split(' ');
    
    if (bearer !== 'Bearer' || !token) {
      throw createHttpError(401, 'Invalid authorization format. Use "Bearer <token>"');
    }

    // Валідуємо access token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw createHttpError(401, 'Access token expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw createHttpError(401, 'Invalid access token');
      } else {
        throw createHttpError(401, 'Token verification failed');
      }
    }

    // Шукаємо користувача в базі даних
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    // Додаємо користувача до об'єкту запиту
    req.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    // Переходимо до наступного middleware/контролера
    next();
  } catch (error) {
    // Якщо це наша помилка 401 - пробрасуємо її далі
    if (error.status === 401) {
      next(error);
    } else {
      // Інші помилки обгортаємо в загальну помилку
      next(createHttpError(500, `Authentication failed: ${error.message}`));
    }
  }
};
