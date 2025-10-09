/**
 * Middleware для валідації даних з multipart/form-data
 * Використовується після multer middleware
 * 
 * Multer парсить multipart/form-data і поміщає:
 * - текстові поля в req.body
 * - файли в req.file або req.files
 * 
 * Цей middleware валідує req.body за допомогою Joi схеми
 * 
 * @param {Object} schema - Joi схема для валідації
 * @returns {Function} - Express middleware
 */
export const validateFormData = (schema) => {
  return (req, res, next) => {
    // Якщо в body є дані - валідуємо їх
    if (Object.keys(req.body).length > 0) {
      // Конвертуємо строкові значення boolean в справжні boolean
      // Multer передає всі поля як строки
      const processedBody = { ...req.body };
      
      // Обробка boolean полів
      if (processedBody.isFavourite !== undefined) {
        processedBody.isFavourite = processedBody.isFavourite === 'true';
      }
      
      // Валідуємо оброблені дані
      const { error, value } = schema.validate(processedBody, {
        abortEarly: false, // Збираємо всі помилки, а не тільки першу
        stripUnknown: true, // Видаляємо поля, яких немає в схемі
      });
      
      if (error) {
        // Форматуємо помилки валідації
        const errorMessage = error.details
          .map((detail) => detail.message)
          .join(', ');
        
        return res.status(400).json({
          status: 400,
          message: `Validation error: ${errorMessage}`,
          errors: error.details,
        });
      }
      
      // Зберігаємо валідовані дані
      req.validatedBody = value;
    }
    
    next();
  };
};

