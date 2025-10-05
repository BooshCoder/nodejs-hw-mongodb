import Joi from 'joi';

export const querySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .optional()
    .messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1',
    }),
  perPage: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .optional()
    .messages({
      'number.base': 'PerPage must be a number',
      'number.integer': 'PerPage must be an integer',
      'number.min': 'PerPage must be at least 1',
      'number.max': 'PerPage must be no more than 100',
    }),
  sortBy: Joi.string()
    .valid('name', 'phoneNumber', 'email', 'contactType', 'createdAt', 'updatedAt')
    .optional()
    .messages({
      'any.only': 'SortBy must be one of: name, phoneNumber, email, contactType, createdAt, updatedAt',
    }),
  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .optional()
    .messages({
      'any.only': 'SortOrder must be either "asc" or "desc"',
    }),
  type: Joi.string()
    .valid('work', 'home', 'personal')
    .optional()
    .messages({
      'any.only': 'Type must be one of: work, home, personal',
    }),
  isFavourite: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'isFavourite must be a boolean value',
    }),
});

export const createContactSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(20)
    .required()
    .messages({
      'string.min': 'Name must be at least 3 characters long',
      'string.max': 'Name must be no more than 20 characters long',
      'any.required': 'Name is required',
    }),
  phoneNumber: Joi.string()
    .min(3)
    .max(20)
    .required()
    .messages({
      'string.min': 'Phone number must be at least 3 characters long',
      'string.max': 'Phone number must be no more than 20 characters long',
      'any.required': 'Phone number is required',
    }),
  email: Joi.string()
    .email()
    .min(3)
    .max(20)
    .optional()
    .messages({
      'string.email': 'Email must be a valid email address',
      'string.min': 'Email must be at least 3 characters long',
      'string.max': 'Email must be no more than 20 characters long',
    }),
  isFavourite: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'isFavourite must be a boolean value',
    }),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .required()
    .messages({
      'any.only': 'Contact type must be one of: work, home, personal',
      'any.required': 'Contact type is required',
    }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(20)
    .optional()
    .messages({
      'string.min': 'Name must be at least 3 characters long',
      'string.max': 'Name must be no more than 20 characters long',
    }),
  phoneNumber: Joi.string()
    .min(3)
    .max(20)
    .optional()
    .messages({
      'string.min': 'Phone number must be at least 3 characters long',
      'string.max': 'Phone number must be no more than 20 characters long',
    }),
  email: Joi.string()
    .email()
    .min(3)
    .max(20)
    .optional()
    .messages({
      'string.email': 'Email must be a valid email address',
      'string.min': 'Email must be at least 3 characters long',
      'string.max': 'Email must be no more than 20 characters long',
    }),
  isFavourite: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'isFavourite must be a boolean value',
    }),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .optional()
    .messages({
      'any.only': 'Contact type must be one of: work, home, personal',
    }),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});
