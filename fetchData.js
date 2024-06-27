const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');


async function fetchData() {
    try {
        let siteIndex = 0
        const response = await axios.get('https://www.stadtbibliothek.oldenburg.de/olsuchergebnisse' +
            '?p_p_id=searchResult_WAR_arenaportlet&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&_searchResult_WAR_arenaportlet' +
            '__wu=%2FsearchResult%2F%3Fwicket%3Ainterface%3D%3A5%3AsearchResultPanel%3AcontainerNavigatorTop%3AnavigatorTop%3A' +
            'navigation%3A' + siteIndex +'%3ApageLink%3A%3AILinkListener%3A%3A'); // Replace with the target URL
        const html = response.data;
        const $ = cheerio.load(html);
        let output = []
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
            const imgUrl = "https://www.stadtbibliothek.oldenburg.de/" + $(el).find('.arena-book-jacket a img').attr('src');
            const url = $(el).find('.arena-record-title a').attr('href');

            output.push({
                recordId,
                title,
                author,
                year,
                language,
                genre,
                imgUrl,
                url
            })
        })


        // Save the title to a JSON file

        fs.writeFileSync('data.json', JSON.stringify(output, null, 2));
        console.log('Data saved to data.json');
    } catch (error) {
        console.error('Error fetching data:', error);
        process.exit(1);
    }
}

fetchData();