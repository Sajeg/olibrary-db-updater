const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const {CookieJar} = require('tough-cookie');

// Create a new CookieJar instance
const cookieJar = new CookieJar();

async function fetchData() {
    try {
        let siteIndex = 1
        let output = []

        while (siteIndex < 2) {
            let response = await axios.get('https://www.stadtbibliothek.oldenburg.de/olsuchergebnisse?p_p_id=searchResult_WAR_arenaportlet&p_p_lifecycle=1&p_p_state=normal&p_r_p_arena_urn%3Aarena_facet_queries=&p_r_p_arena_urn%3Aarena_search_query=organisationId_index%3AADEOLDENBURG%5C%7C1+AND+mediaClass_index%3Abook&p_r_p_arena_urn%3Aarena_search_type=solr&p_r_p_arena_urn%3Aarena_sort_advice=field%3DRelevance%26direction%3DDescending',
                {
                    jar: cookieJar,
                    withCredentials: true
                });

            let html = response.data;
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

            // let pageNavigation = $('.arena-header .arena-page-number a')
            // let url
            // siteIndex++;
            // pageNavigation.each((i, el) => {
            //     if ($(el).text().trim() === siteIndex) {
            //         url = $(el).attr('href');
            //     } else {
            //         console.log("This " + $(el).text().trim() + " is not url: " + $(el).attr('href'));
            //     }
            // })
            // console.log("URl: " + url);
            // response = await axios.get(url);
            // Print all pagination links
            const paginationLinks = $('.arena-page-number a');
            paginationLinks.each((i, el) => {
                console.log(`Page ${$(el).text().trim()}: ${$(el).attr('href')}`);
            });

            // Extract the link to page two
            const pageTwoLink = paginationLinks.filter((i, el) => $(el).text().trim() === '2').attr('href');
            console.log('Link to page two:', pageTwoLink);

            // Update siteIndex or break loop based on your pagination logic
            siteIndex++;

            // If there's a pageTwoLink, make a request to page two
            if (pageTwoLink) {
                response = await axios.get(pageTwoLink, {
                    jar: cookieJar // Send cookies with the request to page two
                });
                console.log("Page two?!")
                let html = response.data;
                let $ = cheerio.load(html);

                //Get the elements
                const elements = $('.arena-record');
                elements.each((i, el) => {
                    const recordId = $(el).find('.arena-record-id').text();
                    const title = $(el).find('.arena-record-title a span').text();
                    console.log("title:", title);
                })
            }


            // Save the title to a JSON file

            fs.writeFileSync('data.json', JSON.stringify(output, null, 2));
            console.log('Data saved to data.json');
        }
    } catch
        (error) {
        console.error('Error fetching data:', error);
        process.exit(1);
    }
}

fetchData();