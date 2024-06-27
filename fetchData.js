const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');


async function fetchData() {
    try {
        const response = await axios.get('https://www.stadtbibliothek.oldenburg.de/olsuchergebnisse?p_r_p_arena_urn%3Aarena_search_query=mediaClass_index%3Abook'); // Replace with the target URL
        const html = response.data;
        const $ = cheerio.load(html);

        // Scrape the title
        const title = $('.arena-record-title a span').first().text();

        // Save the title to a JSON file
        const data = { title };
        fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
        console.log('Data saved to data.json');
    } catch (error) {
        console.error('Error fetching data:', error);
        process.exit(1);
    }
}

fetchData();