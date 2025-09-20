import { Contact } from '../models/contact.js';

export const getAllContacts = async () => {
  try {
    const contacts = await Contact.find();
    return contacts;
  } catch (error) {
    throw new Error(`Failed to get contacts: ${error.message}`);
  }
};

export const getContactById = async (contactId) => {
  try {
    const contact = await Contact.findById(contactId);
    return contact;
  } catch (error) {
    throw new Error(`Failed to get contact: ${error.message}`);
  }
};

export const createContact = async (contactData) => {
  try {
    const contact = new Contact(contactData);
    const savedContact = await contact.save();
    return savedContact;
  } catch (error) {
    throw new Error(`Failed to create contact: ${error.message}`);
  }
};

export const updateContact = async (contactId, updateData) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      updateData,
      { new: true, runValidators: true }
    );
    return updatedContact;
  } catch (error) {
    throw new Error(`Failed to update contact: ${error.message}`);
  }
};

export const deleteContact = async (contactId) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(contactId);
    return deletedContact;
  } catch (error) {
    throw new Error(`Failed to delete contact: ${error.message}`);
  }
};