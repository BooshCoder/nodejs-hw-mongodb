import nodemailer from 'nodemailer';

/**
 * Utility функція для відправки email через SMTP Brevo
 * 
 * @param {Object} options - Опції для відправки email
 * @param {string} options.to - Email отримувача
 * @param {string} options.subject - Тема листа
 * @param {string} options.html - HTML контент листа
 * @param {string} options.text - Текстовий контент листа (опціонально)
 * 
 * @returns {Promise<Object>} - Результат відправки
 * @throws {Error} - Якщо не вдалося відправити email
 */
export const sendEmail = async (options) => {
  // Створюємо транспортер (підключення до SMTP сервера Brevo)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // smtp-relay.brevo.com
    port: process.env.SMTP_PORT, // 587
    secure: process.env.SMTP_PORT == 465, // true для порту 465 (SSL), false для 587 (TLS)
    auth: {
      user: process.env.SMTP_USER, // ваш SMTP логін з Brevo
      pass: process.env.SMTP_PASSWORD, // ваш SMTP пароль з Brevo
    },
  });

  // Налаштування листа
  const mailOptions = {
    from: process.env.SMTP_FROM, // email, на який зареєстровано Brevo акаунт
    to: options.to, // email отримувача
    subject: options.subject, // тема листа
    text: options.text || '', // текстова версія (опціонально)
    html: options.html, // HTML версія листа
  };

  // Відправляємо email
  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    // Логуємо помилку для дебагу
    console.error('Failed to send email:', error);
    throw error;
  }
};

