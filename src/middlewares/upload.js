import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Отримуємо __dirname в ES6 модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Створюємо тимчасову папку для завантаження файлів
const tmpDir = path.join(__dirname, '../../tmp');

// Перевіряємо чи існує папка tmp, якщо ні - створюємо
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

/**
 * Налаштування сховища для multer
 * Файли зберігаються тимчасово на диску перед завантаженням на Cloudinary
 */
const storage = multer.diskStorage({
  // Визначаємо папку для збереження файлів
  destination: (req, file, cb) => {
    cb(null, tmpDir);
  },
  // Визначаємо ім'я файлу
  filename: (req, file, cb) => {
    // Генеруємо унікальне ім'я: timestamp-randomNumber-originalName
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const ext = path.extname(file.originalname); // розширення файлу (.jpg, .png)
    const basename = path.basename(file.originalname, ext); // ім'я без розширення
    cb(null, `${basename}-${uniqueSuffix}${ext}`);
  },
});

/**
 * Фільтр файлів - дозволяємо тільки зображення
 */
const fileFilter = (req, file, cb) => {
  // Дозволені MIME типи зображень
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    // Файл дозволений
    cb(null, true);
  } else {
    // Файл не дозволений
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed!'), false);
  }
};

/**
 * Налаштування multer
 */
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Максимальний розмір файлу: 5MB
  },
});

/**
 * Middleware для завантаження одного файлу з полем 'photo'
 * Використовується у роутах для завантаження фото контакту
 */
export const uploadPhoto = upload.single('photo');

/**
 * Utility функція для видалення тимчасового файлу
 * Викликається після успішного завантаження на Cloudinary
 * 
 * @param {string} filePath - Шлях до тимчасового файлу
 */
export const deleteTempFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error deleting temp file:', error);
  }
};

