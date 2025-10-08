import createHttpError from 'http-errors';
import { getAllContacts, getContactById as getContactByIdService, createContact as createContactService, updateContact as updateContactService, deleteContact as deleteContactService } from '../services/contacts.js';
export const getContacts = async (req, res) => {
  const { page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', type, isFavourite } = req.validatedQuery || req.query;
  const userId = req.user._id; // Отримуємо userId з авторизованого користувача
  
  const pageNumber = parseInt(page, 10);
  const perPageNumber = parseInt(perPage, 10);
  const isFavouriteBoolean = isFavourite !== undefined ? isFavourite === 'true' : null;
  
  const result = await getAllContacts(userId, pageNumber, perPageNumber, sortBy, sortOrder, type, isFavouriteBoolean);
  
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: result,
  });
};

export const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id; // Отримуємо userId з авторизованого користувача
  const contact = await getContactByIdService(contactId, userId);
  
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContact = async (req, res) => {
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;
  const userId = req.user._id; // Отримуємо userId з авторизованого користувача
  
  // Валідація обов'язкових полів
  if (!name || !phoneNumber || !contactType) {
    throw createHttpError(400, 'Missing required fields: name, phoneNumber, contactType');
  }
  
  const contactData = {
    name,
    phoneNumber,
    contactType,
    userId, // Додаємо userId до даних контакту
    ...(email && { email }),
    ...(isFavourite !== undefined && { isFavourite }),
  };
  
  const newContact = await createContactService(contactData);
  
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id; // Отримуємо userId з авторизованого користувача
  const updateData = req.body;
  
  const updatedContact = await updateContactService(contactId, userId, updateData);
  
  if (!updatedContact) {
    throw createHttpError(404, 'Contact not found');
  }
  
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};

export const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id; // Отримуємо userId з авторизованого користувача
  
  const deletedContact = await deleteContactService(contactId, userId);
  
  if (!deletedContact) {
    throw createHttpError(404, 'Contact not found');
  }
  
  res.status(204).send();
};
