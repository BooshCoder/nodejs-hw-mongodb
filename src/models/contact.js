import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
  },
  email: {
    type: String,
  },
  isFavourite: {
    type: Boolean,
    default: false,
  },
  contactType: {
    type: String,
    enum: ['work', 'home', 'personal'],
    required: [true, 'Contact type is required'],
    default: 'personal',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Зв'язок з моделлю User
    required: [true, 'User ID is required'],
  },
  photo: {
    type: String, // URL фото з Cloudinary
    default: null, // За замовчуванням фото немає
  },
}, {
  timestamps: true, 
});

export const Contact = mongoose.model('Contact', contactSchema);