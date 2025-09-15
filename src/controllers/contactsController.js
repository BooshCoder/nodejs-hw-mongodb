import { getAllContacts, getContactById as getContactByIdService } from '../services/contacts.js';

export const getContacts = async (req, res) => {
  try {
    const contacts = await getAllContacts();
    
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    console.error('Error getting contacts:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: null,
    });
  }
};

export const getContactById = async (req, res) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactByIdService(contactId);
    
    if (!contact) {
      return res.status(404).json({
        message: 'Contact not found',
      });
    }
    
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    console.error('Error getting contact by id:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: null,
    });
  }
};