import express from 'express';
import { getContacts, getContactById, createContact, updateContact, deleteContact } from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { validateFormData } from '../middlewares/validateFormData.js';
import { validateQuery } from '../middlewares/validateQuery.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { uploadPhoto } from '../middlewares/upload.js';
import { createContactSchema, updateContactSchema, querySchema } from '../schemas/contacts.js';

const router = express.Router();

// GET /contacts - отримати всі контакти з пагінацією
router.get('/', authenticate, validateQuery(querySchema), ctrlWrapper(getContacts));

// GET /contacts/:contactId - отримати контакт за ID
router.get('/:contactId', authenticate, isValidId, ctrlWrapper(getContactById));

// POST /contacts - створити новий контакт
// Підтримує як JSON (Content-Type: application/json), так і form-data (Content-Type: multipart/form-data)
router.post(
  '/', 
  authenticate, // Перевіряємо аутентифікацію
  uploadPhoto, // Обробляємо завантаження фото (multer)
  validateFormData(createContactSchema), // Валідуємо дані після multer
  ctrlWrapper(createContact) // Контролер
);

// PATCH /contacts/:contactId - оновити контакт
// Підтримує як JSON (Content-Type: application/json), так і form-data (Content-Type: multipart/form-data)
router.patch(
  '/:contactId', 
  authenticate, // Перевіряємо аутентифікацію
  isValidId, // Перевіряємо валідність ID
  uploadPhoto, // Обробляємо завантаження фото (multer)
  validateFormData(updateContactSchema), // Валідуємо дані після multer
  ctrlWrapper(updateContact) // Контролер
);

// DELETE /contacts/:contactId - видалити контакт
router.delete('/:contactId', authenticate, isValidId, ctrlWrapper(deleteContact));

export default router;
