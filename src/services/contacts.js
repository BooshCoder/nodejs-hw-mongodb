import { Contact } from '../models/contact.js';

export const getAllContacts = async (page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', type = null, isFavourite = null) => {
  try {
    const skip = (page - 1) * perPage;
    const sortDirection = sortOrder === 'desc' ? -1 : 1;
    const sortOptions = { [sortBy]: sortDirection };
    
    const filterOptions = {};
    if (type) {
      filterOptions.contactType = type;
    }
    if (isFavourite !== null) {
      filterOptions.isFavourite = isFavourite;
    }
    
    const [contacts, totalItems] = await Promise.all([
      Contact.find(filterOptions).sort(sortOptions).skip(skip).limit(perPage),
      Contact.countDocuments(filterOptions)
    ]);
    
    const totalPages = Math.ceil(totalItems / perPage);
    const hasPreviousPage = page > 1;
    const hasNextPage = page < totalPages;
    
    return {
      data: contacts,
      page,
      perPage,
      totalItems,
      totalPages,
      hasPreviousPage,
      hasNextPage
    };
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