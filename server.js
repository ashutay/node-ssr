import express from 'express';

import {ssr} from './functions/ssr.js'

const app = express();
app.listen(3000, () => console.log(`http://localhost:3000`))

app.get('/ssr', async (req, res, next) => {

    const {url} = req.query;

    const {html, status} = await ssr(url);

    res.status(status).send(html);

})

