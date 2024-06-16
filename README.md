# Keyword-Based HTTP Client and Server

Этот проект реализует HTTP клиент и сервер для сбора информации из интернета на основе ключевых слов.

## Установка и запуск

### Сервер

1. Клонируйте репозиторий и перейдите в каталог сервера:
   ```bash
   git clone https://github.com/Kssnkx/HttpParser.git
   cd keyword-server
   npm install
   ```
   Установите зависимости:
   ```
   npm install
   npm install ws
   npm install cors
   npm install axios
   npm install express axios
   ```
   Запустите сервер:
   ```
   node server.js
   ```
   Сервер будет запущен на `http://localhost:3000`

   Клиент

    Перейдите в каталог клиента:
   ```
   cd keyword-client
   ```
   ```
   npm start
   ```
   Клиент будет запущен на `http://localhost:3001`


Пример конфигурации
Файл server.js содержит пример конфигурации ключевых слов и URL:
   ```
   const keywords = {
    'example': ['https://example.com', 'https://anotherexample.com']
    }```
