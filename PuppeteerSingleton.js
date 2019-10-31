const puppeteer = require('puppeteer');

const PuppeteerSingleton = (function () {
    let instance;
 
    async function createInstance() {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            //headless: false
        });

        const page = await browser.newPage();

        return {
            browser,
            page
        };
    }
 
    return {
        getInstance: async function () {
            if (!instance) {
                console.log('Puppeteer created!')
                instance = await createInstance();
            }
            return instance;
        }
    };
})();

module.exports = {
    PuppeteerSingleton
};