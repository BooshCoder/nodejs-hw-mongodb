import { v2 as cloudinary } from 'cloudinary';

/**
 * Конфігурація Cloudinary
 * Підключаємося до Cloudinary за допомогою credentials з .env
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Utility функція для завантаження файлу на Cloudinary
 * 
 * @param {string} filePath - Шлях до файлу на локальному сервері
 * @param {Object} options - Додаткові опції для Cloudinary
 * @param {string} options.folder - Папка на Cloudinary (наприклад, 'contacts')
 * @param {string} options.public_id - Унікальний ідентифікатор файлу (опціонально)
 * @param {string} options.resource_type - Тип ресурсу ('image', 'video', 'raw', 'auto')
 * 
 * @returns {Promise<Object>} - Результат завантаження з Cloudinary
 * @throws {Error} - Якщо не вдалося завантажити файл
 */
export const uploadToCloudinary = async (filePath, options = {}) => {
  try {
    // Налаштування за замовчуванням
    const defaultOptions = {
      folder: 'contacts', // Зберігаємо всі фото контактів у папці 'contacts'
      resource_type: 'auto', // Автоматичне визначення типу файлу
      use_filename: true, // Використовувати оригінальне ім'я файлу
      unique_filename: true, // Додати унікальний суфікс до імені
    };

    // Об'єднуємо налаштування за замовчуванням з переданими опціями
    const uploadOptions = { ...defaultOptions, ...options };

    // Завантажуємо файл на Cloudinary
    const result = await cloudinary.uploader.upload(filePath, uploadOptions);

    // Повертаємо результат
    // result містить: public_id, secure_url, url, width, height, format, тощо
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Failed to upload file to Cloudinary: ${error.message}`);
  }
};

/**
 * Utility функція для видалення файлу з Cloudinary
 * 
 * @param {string} publicId - Public ID файлу на Cloudinary
 * @returns {Promise<Object>} - Результат видалення
 * @throws {Error} - Якщо не вдалося видалити файл
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error(`Failed to delete file from Cloudinary: ${error.message}`);
  }
};

export default cloudinary;

