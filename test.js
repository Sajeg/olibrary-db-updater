const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Go to the initial page
    await page.goto('https://www.stadtbibliothek.oldenburg.de/olsuchergebnisse?p_p_id=searchResult_WAR_arenaportlet&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&_searchResult_WAR_arenaportlet__wu=%2FsearchResult%2F%3Fwicket%3Ainterface%3D%3A0%3AsearchResultPanel%3AdataContainer%3AdataView%3A1%3AcontainerItem%3Aitem%3AindexedRecordPanel%3AcoverDecorPanel%3AcoverLink%3A%3AILinkListener%3A%3A');

    // Wait for the page to load
    await page.waitForSelector('.arena-page-number a');

    // Extract the link to page 2
    const pageTwoLink = await page.evaluate(() => {
        const paginationLinks = document.querySelectorAll('.arena-page-number a');
        for (let link of paginationLinks) {
            if (link.innerText.trim() === '2') {
                return link.href;
            }
        }
    });

    console.log('Link to page two:', pageTwoLink);

    // Navigate to page 2
    await page.goto(pageTwoLink);

    // Wait for the page to load
    await page.waitForSelector('.arena-record');

    // Extract data
    const data = await page.evaluate(() => {
        const elements = document.querySelectorAll('.arena-record');
        return Array.from(elements).map(el => {
            return {
                recordId: el.querySelector('.arena-record-id')?.innerText || '',
                title: el.querySelector('.arena-record-title a span')?.innerText || '',
                authors: Array.from(el.querySelectorAll('.arena-record-author .arena-value')).map(a => a.innerText),
                year: el.querySelector('.arena-record-year .arena-value')?.innerText || '',
                language: el.querySelector('.arena-record-language .arena-value')?.innerText.trim() || ''
            };
        });
    });

    console.log('Data from page 2:', data);

    await browser.close();
})();