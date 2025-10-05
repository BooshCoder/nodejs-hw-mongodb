import express from 'express';
import { getContacts, getContactById, createContact, updateContact, deleteContact } from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { validateQuery } from '../middlewares/validateQuery.js';
import { isValidId } from '../middlewares/isValidId.js';
import { createContactSchema, updateContactSchema, querySchema } from '../schemas/contacts.js';

const router = express.Router();

// GET /contacts - отримати всі контакти з пагінацією
router.get('/', validateQuery(querySchema), ctrlWrapper(getContacts));

// GET /contacts/:contactId - отримати контакт за ID
router.get('/:contactId', isValidId, ctrlWrapper(getContactById));

// POST /contacts - створити новий контакт
router.post('/', validateBody(createContactSchema), ctrlWrapper(createContact));

// PATCH /contacts/:contactId - оновити контакт
router.patch('/:contactId', isValidId, validateBody(updateContactSchema), ctrlWrapper(updateContact));

// DELETE /contacts/:contactId - видалити контакт
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContact));

export default router;
