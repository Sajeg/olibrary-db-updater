const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');


async function fetchData() {
    try {
        const response = await axios.get('https://www.meta.com/de/en/'); // Replace with the target URL
        const html = response.data;
        const $ = cheerio.load(html);

        // Scrape the desired data
        // For example, extracting all titles from <h2> elements
        let data = [];
        $('h1').each((index, element) => {
            data.push({
                title: $(element).text()
            });
        });

        // Save the data to a JSON file
        fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
        console.log('Data saved to data.json');
    } catch (error) {
        console.error('Error fetching data:', error);
        process.exit(1);
    }
}

fetchData();