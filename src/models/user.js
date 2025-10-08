import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true, // Автоматично перетворює email в нижній регістр
    trim: true, // Видаляє пробіли на початку та в кінці
    validate: {
      validator: function(v) {
        return /\S+@\S+\.\S+/.test(v);
      },
      message: 'Please provide a valid email address'
    }, // Простий валідатор email
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
}, {
  timestamps: true, // Автоматично додає createdAt та updatedAt
  versionKey: false, // Прибираємо __v поле
});

export const User = mongoose.model('User', userSchema);

