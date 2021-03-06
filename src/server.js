import express from 'express';

import {ssr} from './functions/ssr.js'
import {Cache} from "./functions/cache";
import {Cron} from "./cron";

const CACHE = new Cache();
const CRON = new Cron(CACHE);
CRON.initTasks();

const app = express();
app.listen(3000, () => console.log(`http://localhost:3000`))

/**
 * Метод получения количество кешированных url
 */
app.get('/cnt', async (req, res, next) => {
    return res.status(200).send(CACHE.getSize());
});

/**
 * Метод получения списка кешированных url
 */
app.get('/status', async (req, res, next) => {
    return res.status(200).send(CACHE.getList());
});

/**
 * Метод принудительного сброса кеша
 */
app.get('/clear_cache', async (req, res, next) => {
    CACHE.clear()
    return res.status(200).send('The cache has been deleted');
});

/**
 * Метод отдачи отрендеренного контента
 * @type {null}
 */
app.get('/ssr', async (req, res, next) => {

    const {url} = req.query;

    if (!url) {
        return res.status(400).send('Invalid url param: Example: ?url=https://google.com/');
    }

    /**
     * Отдача страницы из кеша (при наличии)
     */
    let page = CACHE.getPageByURL(url);
    if (page) {
        return res.status(page.status).send(page.html);
    }

    const {html, status, redirect} = await ssr(url, true);

    if (status === 200) {
        CACHE.setPage(url, html, status)
    }

    /**
     * Обработка редиректов
     */
    if (redirect) {
        return res.set('Redirect', redirect).status(status).send();
    }

    res.status(status).send(html);
})

