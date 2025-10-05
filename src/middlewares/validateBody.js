import createHttpError from 'http-errors';


export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      const validationError = createHttpError(400, `Validation error: ${errorMessages.join(', ')}`);
      return next(validationError);
    }

    req.body = value;
    next();
  };
};
