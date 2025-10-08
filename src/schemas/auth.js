import Joi from 'joi';

// Схема для реєстрації користувача
export const registerUserSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.base': 'Name must be a string',
      'string.min': 'Name must be at least 3 characters long',
      'string.max': 'Name must be no more than 30 characters long',
      'any.required': 'Name is required',
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.base': 'Email must be a string',
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is required',
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.base': 'Password must be a string',
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required',
    }),
});

// Схема для логіну користувача
export const loginUserSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.base': 'Email must be a string',
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is required',
    }),
  password: Joi.string()
    .required()
    .messages({
      'string.base': 'Password must be a string',
      'any.required': 'Password is required',
    }),
});

