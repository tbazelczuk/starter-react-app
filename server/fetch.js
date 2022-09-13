const axios = require('axios');
const cheerio = require("cheerio");

async function fetch({ url, selector }) {
    console.log("fetch", url, selector);

    try {
        const resp = await axios.get(url);
        let $ = cheerio.load(resp.data);

        if(selector.startsWith('noscript')) {
            $ = cheerio.load($('noscript').first().html())
            selector = selector.replace('noscript', '').trim()
        }

        return ($(selector).first().text() || '').trim();
    } catch (err) {
        console.log(err);
    }
}

module.exports = fetch;
