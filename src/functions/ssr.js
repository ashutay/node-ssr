import puppeteer from 'puppeteer';

export async function ssr(url) {

    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
            '--window-size=1920x1080',
            '--single-process',
            '--no-zygote'
        ],
    });

    const page = await browser.newPage();
    page.setViewport({ width: 1280, height: 926 });

    try {

        /**
         * Установка http_auth из .enl.local
         */
        if (process.env.HTTP_USER && process.env.HTTP_PASS) {
            await page.authenticate({'username': process.env.HTTP_USER, 'password': process.env.HTTP_PASS});
        }

        const response = await page.goto(url, {
            timeout: 25000,
            waitUntil: 'networkidle2'
        });

        if (response.status() < 400) {

            let status = response.status();
            let redirect = '';

            /**
             * Обработка 301 и 302 редиректа
             * @type {!Array<!Request>}
             */
            const chain = response.request().redirectChain();
            for ( let num in chain ) {
                if(chain[num].response().headers().p3p)
                {
                    let chainStatus = chain[num].response().headers().status;
                    if ((chainStatus === '301') || (chainStatus === '302')) {
                        status = chainStatus;
                        redirect = chain[num].response().headers().location;
                    }
                }
            }

            /**
             * Удаление всего JS
             */
            await page.evaluate(() => {
                const elements = document.querySelectorAll('script:not([type="application/ld+json"]), link[rel="import"]');
                elements.forEach(e => e.remove());
            });

            let html = await page.content();

            await page.close();
            browser.close();

            return {html, status: status, redirect: redirect}
        }

        let html = null;

        await page.close();
        browser.close();

        return {html, status: response.status()}

    } catch (e) {
        let html = e.toString();
        console.warn({message: `URL: ${url} Failed with message: ${html}`})

        await page.close();
        browser.close();

        return {html, status: 500}
    }

}


