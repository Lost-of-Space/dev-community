# Dev-Space

Dev-Space — це вебзастосунок, що складається з двох модулів:
- **server/** (бекенд)
- **dev-fe/** (фронтенд)

## Запуск проєкту

Щоб підняти проєкт для розробки, необхідно створити два `.env` файли.

### Налаштування середовища

#### `server/.env`
```ini
DB_LOCATION=
SECRET_ACCESS_KEY=
```

#### `dev-fe/.env`
```ini
VITE_SERVER_DOMAIN=http://localhost:3000

# Для вивантаження зображень
VITE_CLOUDINARY_UPLOAD_PRESET=
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_URL=
```
> **Примітка:** Теоретично можна обійтися лише `VITE_SERVER_DOMAIN`, але це не тестувалося. 😃

## Запуск

### Бекенд
Перейдіть у папку `server/` і виконайте команду:
```sh
npm install
npm run dev
```

### Фронтенд
Перейдіть у папку `dev-fe/` і виконайте команду:
```sh
npm install
npm run dev
```
