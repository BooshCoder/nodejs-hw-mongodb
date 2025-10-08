import express from 'express';
import { getContacts, getContactById, createContact, updateContact, deleteContact } from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { validateQuery } from '../middlewares/validateQuery.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { createContactSchema, updateContactSchema, querySchema } from '../schemas/contacts.js';

const router = express.Router();

// GET /contacts - отримати всі контакти з пагінацією
router.get('/', authenticate, validateQuery(querySchema), ctrlWrapper(getContacts));

// GET /contacts/:contactId - отримати контакт за ID
router.get('/:contactId', authenticate, isValidId, ctrlWrapper(getContactById));

// POST /contacts - створити новий контакт
router.post('/', authenticate, validateBody(createContactSchema), ctrlWrapper(createContact));

// PATCH /contacts/:contactId - оновити контакт
router.patch('/:contactId', authenticate, isValidId, validateBody(updateContactSchema), ctrlWrapper(updateContact));

// DELETE /contacts/:contactId - видалити контакт
router.delete('/:contactId', authenticate, isValidId, ctrlWrapper(deleteContact));

export default router;
