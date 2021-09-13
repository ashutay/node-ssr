import express from 'express';

import {ssr} from './functions/ssr.js'
import {Cache} from "./functions/cache";

const CACHE = new Cache();

const app = express();
app.listen(3000, () => console.log(`http://localhost:3000`))

/**
 * Метод отдачи отрендеренного контента
 * @type {null}
 */
APP.get('/ssr', async (req, res, next) => {

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

    const {html, status} = await ssr(url, true);

    if (status === 200) {
        CACHE.setPage(url, html, status)
    }

    res.status(status).send(html);
})

