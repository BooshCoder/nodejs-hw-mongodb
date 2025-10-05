import createHttpError from 'http-errors';

export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      const validationError = createHttpError(400, `Query validation error: ${errorMessages.join(', ')}`);
      return next(validationError);
    }

    req.validatedQuery = value;
    next();
  };
};
