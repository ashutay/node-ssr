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
        const response = await page.goto(url, {
            timeout: 25000,
            waitUntil: 'networkidle2'
        });

        if (response.status() < 400) {

            let status = response.status();

            let html = await page.content();

            await page.close();
            browser.close();

            return {html, status: status}
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


