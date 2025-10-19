# 📇 Contacts API

REST API для управління контактами з JWT авторизацією та завантаженням фото.

---

## 🚀 Швидкий старт

```bash
# Встановити залежності
npm install

# Створити .env файл
PORT=3000
MONGODB_USER=your_username
MONGODB_PASSWORD=your_password
MONGODB_URL=your_mongodb_url
MONGODB_DB=your_database_name
JWT_SECRET=your_jwt_secret

# Запустити сервер
npm run dev

# Відкрити документацію
http://localhost:3000/api-docs
```

---

## 📖 API Документація

### Swagger UI (інтерактивна документація)

```
http://localhost:3000/api-docs
```

- Можна тестувати всі endpoints
- Авторизація через Bearer token
- Приклади запитів та відповідей

### Альтернативно

```bash
npm run preview-docs  # Redocly preview
npm run build         # Генерує docs/swagger.json для Postman
```

---

## 🔐 Автентифікація

API використовує JWT токени. Access token (15 хв) + Refresh token в cookie (30 днів).

**Отримати токен:**

```bash
# 1. Реєстрація
POST /auth/register
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}

# 2. Вхід
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
# Відповідь: { "data": { "accessToken": "..." } }

# 3. Використання
GET /contacts
Authorization: Bearer <accessToken>
```

---

## 📋 Endpoints

### Auth (публічні)

| Метод | Endpoint                 | Опис                     |
| ----- | ------------------------ | ------------------------ |
| POST  | `/auth/register`         | Реєстрація               |
| POST  | `/auth/login`            | Вхід (отримати токен)    |
| POST  | `/auth/refresh`          | Оновити токен (cookie)   |
| POST  | `/auth/logout`           | Вихід                    |
| POST  | `/auth/send-reset-email` | Запит на скидання паролю |
| POST  | `/auth/reset-pwd`        | Скинути пароль           |

### Contacts (потребують Bearer token)

| Метод  | Endpoint        | Опис                                         |
| ------ | --------------- | -------------------------------------------- |
| GET    | `/contacts`     | Список (пагінація, фільтри, сортування)      |
| POST   | `/contacts`     | Створити контакт (JSON або form-data з фото) |
| GET    | `/contacts/:id` | Отримати за ID                               |
| PATCH  | `/contacts/:id` | Оновити (всі поля опціональні)               |
| DELETE | `/contacts/:id` | Видалити                                     |

---

## 💡 Приклади

### Отримати список контактів

```bash
GET /contacts?page=1&perPage=10&sortBy=name&sortOrder=asc&isFavourite=true
Authorization: Bearer <token>
```

**Query параметри:**

- `page`, `perPage` - пагінація
- `sortBy`, `sortOrder` - сортування (name, email, phoneNumber, etc.)
- `isFavourite` - фільтр за улюбленими
- `contactType` - work, home, personal

### Створити контакт

```bash
# JSON
POST /contacts
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Smith",
  "phoneNumber": "+380509876543",
  "email": "jane@example.com",
  "contactType": "work",
  "isFavourite": true
}

# З фото (multipart/form-data)
POST /contacts
Authorization: Bearer <token>
Content-Type: multipart/form-data

name=Jane Smith
phoneNumber=+380509876543
contactType=work
photo=<file>
```

### Оновити контакт

```bash
PATCH /contacts/:id
Authorization: Bearer <token>

{
  "isFavourite": false,
  "phoneNumber": "+380501111111"
}
```

---

## 🏗️ Технології

- **Backend:** Node.js, Express 5, MongoDB + Mongoose
- **Безпека:** JWT, Bcrypt, CORS
- **Файли:** Cloudinary, Multer
- **Email:** Nodemailer
- **Валідація:** Joi
- **Документація:** Swagger UI, OpenAPI 3.1

---

## 📁 Структура

```
src/
├── controllers/   # Обробники запитів
├── services/      # Бізнес-логіка + робота з БД
├── models/        # Mongoose моделі (User, Contact, Session)
├── routers/       # Express роутери
├── middlewares/   # authenticate, validateBody, upload, errorHandler
├── schemas/       # Joi валідація
├── utils/         # cloudinary, sendEmail, ctrlWrapper
└── server.js      # Express + Swagger UI

docs/              # OpenAPI документація
swagger/           # Модульна структура (components, paths)
```

---

## ⚙️ Змінні оточення (.env)

```env
# Server
PORT=3000

# MongoDB
MONGODB_USER=username
MONGODB_PASSWORD=password
MONGODB_URL=cluster.mongodb.net
MONGODB_DB=database_name

# JWT
JWT_SECRET=your_secret_key

# SMTP (для email)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=app_password

# Cloudinary (для фото)
CLOUDINARY_CLOUD_NAME=name
CLOUDINARY_API_KEY=key
CLOUDINARY_API_SECRET=secret
```

---

## 🛠️ Команди

```bash
npm start              # Production
npm run dev            # Development (nodemon)
npm run build          # Зібрати swagger.json
npm run preview-docs   # Redocly preview
```

---

## 🧪 Тестування

**Через Swagger UI:**

1. Запустити: `npm run dev`
2. Відкрити: http://localhost:3000/api-docs
3. POST /auth/login → скопіювати accessToken
4. Кнопка "Authorize" → ввести `Bearer <token>`
5. Тестувати endpoints!

**Через Postman:**

1. `npm run build`
2. Імпортувати `docs/swagger.json`
3. Налаштувати Authorization: Bearer Token

---

## ⚠️ Типові помилки

| Код | Причина                | Рішення                                            |
| --- | ---------------------- | -------------------------------------------------- |
| 400 | Невалідні дані         | Перевірте обов'язкові поля та формати              |
| 401 | Немає/невалідний токен | Увійдіть і додайте `Authorization: Bearer <token>` |
| 404 | Ресурс не знайдено     | Перевірте ID (має бути MongoDB ObjectId)           |
| 409 | Email вже існує        | Використайте інший email                           |

---

## 📊 Моделі даних

**User:**

```javascript
{
  _id, name, email, password(hashed), createdAt, updatedAt;
}
```

**Contact:**

```javascript
{
  _id, name, phoneNumber, email, isFavourite,
  contactType (work|home|personal), photo (Cloudinary URL),
  userId (ref User), createdAt, updatedAt
}
```

**Session:**

```javascript
{
  _id,
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
    createdAt,
    updatedAt;
}
```

---

## 🔒 Безпека

- JWT токени (access 15 хв, refresh 30 днів)
- HTTP-only cookies для refresh token
- Bcrypt для паролів
- Joi валідація всіх даних
- CORS налаштовано
- Mongoose захист від injection

**Для production:**

- Використовуйте HTTPS
- Змініть JWT_SECRET
- Не комітьте .env
- Розгляньте rate limiting

---

Made with ❤️ and Node.js
