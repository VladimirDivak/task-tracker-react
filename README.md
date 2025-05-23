# Task Tracker

Приложение для отслеживания задач с использованием React, TypeScript, Express и MongoDB.

## Структура проекта

```
task-tracker/
├── frontend/          # React приложение
└── backend/           # Express API сервер
```

## Требования

- Node.js (v14 или выше)
- MongoDB
- Yarn

## Установка и запуск

### Backend

1. Перейдите в директорию backend:
```bash
cd backend
```

2. Установите зависимости:
```bash
yarn install
```

3. Создайте файл .env на основе .env.example и настройте переменные окружения

4. Запустите сервер разработки:
```bash
yarn dev
```

### Frontend

1. Перейдите в директорию frontend:
```bash
cd frontend
```

2. Установите зависимости:
```bash
yarn install
```

3. Запустите приложение разработки:
```bash
yarn dev
```

## API Endpoints

### Tasks

- GET /api/tasks - Получить все задачи
- GET /api/tasks/:id - Получить задачу по ID
- POST /api/tasks - Создать новую задачу
- PUT /api/tasks/:id - Обновить задачу
- DELETE /api/tasks/:id - Удалить задачу

## Технологии

### Frontend
- React
- TypeScript
- Vite
- Redux Toolkit
- React Router
- Material-UI
- Axios

### Backend
- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- JWT для аутентификации 