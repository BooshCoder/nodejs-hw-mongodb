import createHttpError from 'http-errors';
import mongoose from 'mongoose';


export const isValidId = (req, res, next) => {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    const error = createHttpError(400, `Invalid contact ID: ${contactId}`);
    return next(error);
  }

  next();
};
