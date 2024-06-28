const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const tough = require('tough-cookie');
const {wrapper} = require('axios-cookiejar-support');

// Create a new CookieJar instance
const cookieJar = new tough.CookieJar(undefined, {looseMode: true});
const client = wrapper(axios.create({
    withCredentials: true, // Ensure credentials are sent with requests
    jar: cookieJar // Attach the cookie jar
}));

async function fetchData() {
    let response = await client.get('https://www.stadtbibliothek.oldenburg.de/olerweiterteSuche');
    let html = response.data;
    let $ = cheerio.load(html);
    let url = $('.arena-extended-search-original-bottom-buttons .arena-input-submit')
        .attr('onclick')
        .match(/'(https:\/\/www\.stadtbibliothek\.oldenburg\.de\/[^']+)'/)[0]
        .replace("'", "");

    console.log(url);

    try {
        let siteIndex = 1
        let output = []

        while (siteIndex < 4) {
            siteIndex++;
            let response = await client.get(url);

            let html = response.data;
            let $ = cheerio.load(html);

            console.log("Now processing: " + siteIndex)

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
                const type = $(el).find('.arena-record-media .arena-value').text();
                const imgUrl = "https://www.stadtbibliothek.oldenburg.de/" + $(el).find('.arena-book-jacket a img').attr('src');
                const url = $(el).find('.arena-record-title a').attr('href');

                output.push({
                    recordId,
                    title,
                    author,
                    year,
                    language,
                    genre,
                    type,
                    imgUrl,
                    url
                })
            })


            // let pageNavigation = $('.arena-header .arena-page-number a')
            // // let url
            // siteIndex++;
            // pageNavigation.each((i, el) => {
            //     if ($(el).text().trim() === "Nächste Seite") {
            //         url = $(el).attr('href');
            //     } else {
            //         // console.log("This " + $(el).text().trim() + " is not url: " + $(el).attr('href'));
            //     }
            // })

            // Log the cookies
            console.log('Cookies stored after request:');
            cookieJar.getCookies('https://www.stadtbibliothek.oldenburg.de', (err, cookies) => {
                if (err) {
                    console.error('Error getting cookies:', err);
                } else {
                    cookies.forEach(cookie => {
                        console.log(cookie.toString());
                    });
                }
            });

            // Extract the link to the next page
            const nextPageLink = $('.arena-record-navigation ').find('.arena-navigation-arrow');
            nextPageLink.each((i, el) => {
                if ($(el).attr("title") === "Nächste Seite") {
                    url = $(el).attr('href');
                    console.log('Next page URL:', url);
                }
            })

            console.log(url)
            // console.log("URl: " + url);
            // response = await axios.get(url);
            // Print all pagination links
            // const paginationLinks = $('.arena-page-number a');
            // paginationLinks.each((i, el) => {
            //     console.log(`Page ${$(el).text().trim()}: ${$(el).attr('href')}`);
            // });
            //
            // // Extract the link to page two
            // const pageTwoLink = paginationLinks.filter((i, el) => $(el).text().trim() === '2').attr('href');
            // console.log('Link to page two:', pageTwoLink);

            // Update siteIndex or break loop based on your pagination logic
            // siteIndex++;

            // If there's a pageTwoLink, make a request to page two
        }

        // Save the title to a JSON file

        fs.writeFileSync('data.json', JSON.stringify(output, null, 2));
        console.log('Data saved to data.json');

    } catch
        (error) {
        console.error('Error fetching data:', error);
        process.exit(1);
    }
}

fetchData();