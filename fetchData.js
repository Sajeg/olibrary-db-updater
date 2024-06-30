const puppeteer = require('puppeteer');
const cheerio = require("cheerio");
const fs = require("fs");

let output = [];
let siteNumber = 1;

async function fetchData() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();

    console.log("Opened Browser page");

    await page.goto('https://www.stadtbibliothek.oldenburg.de/olerweiterteSuche');

    console.log("Opened URL")

    await page.select('#id__extendedSearch__WAR__arenaportlet____f', 'book');

    console.log("Selected Book")

    await page.click('#id__extendedSearch__WAR__arenaportlet____13');

    console.log("Clicked on Button")

    await page.waitForSelector('.feedbackPanelINFO', {timeout: 5000})

    console.log("Waited until it loads")

    let pageContent = await page.content();
    await scrapData(pageContent);
    console.log("Scraped Data");

    let nextPage = await hasNextPage(pageContent);

    while (nextPage) {
        await page.click('a.arena-navigation-arrow[title="Nächte Seite"]');
        siteNumber++;
        console.log("Navigated to page " + siteNumber);

        try {
            await page.waitForSelector('.arena-record-container', {timeout: 5000})
        } catch (e) {
            await page.reload()
            await page.waitForSelector('.arena-record-container', {timeout: 5000})
        }
        console.log("Waited until it loaded")

        pageContent = await page.content();
        await scrapData(pageContent)
        console.log("Scraped Data");

        nextPage = await hasNextPage(pageContent);
    }

    await browser.close();
    console.log("Closed browser");

    const isoDate = new Date().toISOString();
    const info = {
        last_update: isoDate,
    }

    fs.writeFileSync('info.json', JSON.stringify(info, null, 2));
    fs.writeFileSync('data.json', JSON.stringify(output, null, 2));
    console.log('Finished updating the books');
}

async function scrapData(html) {
    let $ = cheerio.load(html);

    //Get the elements
    const elements = $('.arena-record');
    elements.each((i, el) => {
        const recordId = $(el).find('.arena-record-id').text();
        const title = $(el).find('.arena-record-title a span').text();
        const author = [];
        $(el).find('.arena-record-author .arena-value').each((i, authorEl) => {
            author.push($(authorEl).text());
        });
        const year = $(el).find('.arena-record-year .arena-value').text();
        const language = $(el).find('.arena-record-language .arena-value').text().trim();
        const genre = $(el).find('.arena-record-genre .arena-value').text();
        const series = $(el).find('.arena-record-series .arena-value').text();
        const imgUrl = "https://www.stadtbibliothek.oldenburg.de" + $(el).find('.arena-book-jacket a img').attr('src');
        const url = $(el).find('.arena-record-title a').attr('href');

        output.push({
            recordId,
            title,
            author,
            year,
            language,
            genre,
            series,
            imgUrl,
            url
        })
    })
}

async function hasNextPage(html) {
    const $ = cheerio.load(html);
    let pageNavigation = $('.arena-header .arena-navigation-arrow');
    let url
    pageNavigation.each((i, el) => {
        if ($(el).attr('title') === "Nächte Seite") {
            url = $(el).attr('href');
        }
    })
    return url !== undefined;
}

fetchData();