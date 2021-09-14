# Server side rendering with puppeteer / headless chrome


### DEV установка

[Node.js 8+](https://nodejs.org/)

```sh
$ npm install
$ npm run dev
```

#### Использование

```sh
$ npm run dev
```
* Запустится локальный сервер

Доступные адреса:

* `http://localhost:3000/ssr?url=THE_URL_TO_RENDER` - Вернёт отрендеренную страницу по url
* `http://localhost:3000/status` - Выводит список кешированных страниц
* `http://localhost:3000/cnt` - Выводит количество кешированных страниц
* `http://localhost:3000/clear_cache` - Метод принудительной очистки кеша

Сервер поддерживает nodemon и перезапускается при модификации файлов в /src

### Сборка образа для production

#### Сборка

```sh
$ docker build -t ecom/ssr-image .
```

#### Запуск

```sh
$  docker run --cap-add=SYS_ADMIN -p 3000:3000 -d --restart unless-stopped ecom/ssr-image
```
В файле .env.local можно установить требуемые переменные окружения:
HOST - обрабатываемый домен
HTTP_USER - логин для http авторизации
HTTP_PASS - пароль для http авторизации
CACHE_TIME - время жизни кеша
