const puppeteer = require('puppeteer');
const axios = require('axios');
const tough = require('tough-cookie');
const { CookieJar } = tough;

// Create a new CookieJar instance
const cookieJar = new CookieJar();

// Axios instance with configured cookie jar
const axiosInstance = axios.create({
  jar: cookieJar, // Use the created cookie jar
  withCredentials: true // Enable sending cookies
});

// Example usage
axiosInstance.get('https://www.stadtbibliothek.oldenburg.de/olsuchergebnisse?p_p_id=searchResult_WAR_arenaportlet&p_p_lifecycle=1&p_p_state=normal&p_r_p_arena_urn%3Aarena_facet_queries=&p_r_p_arena_urn%3Aarena_search_query=organisationId_index%3AADEOLDENBURG%5C%7C1+AND+mediaClass_index%3Abook&p_r_p_arena_urn%3Aarena_search_type=solr&p_r_p_arena_urn%3Aarena_sort_advice=field%3DRelevance%26direction%3DDescending')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
//
// function constructPageUrl(pageNumber) {
//     const baseUrl = 'https://www.stadtbibliothek.oldenburg.de/olsuchergebnisse?p_p_id=searchResult_WAR_arenaportlet&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view';
//     const navigationOrder = pageNumber - 1; // Adjusting navigationOrder calculation
//     const encodedPart = `%2FsearchResult%2F%3Fwicket%3Ainterface%3D%3A89%3AsearchResultPanel%3AcontainerNavigatorTop%3AnavigatorTop%3Anavigation%3A${navigationOrder}%3ApageLink%3A${pageNumber}%3AILinkListener%3A%3A`;
//     return `${baseUrl}&_searchResult_WAR_arenaportlet__wu=${encodedPart}`;
// }
//
// const page5Url = constructPageUrl(9);
// console.log(page5Url);
//
// (async () => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//
//     page.on('console', msg => {
//         if (msg.type() === 'error') {
//             console.error('Error:', msg.text());
//         }
//     });
//
//     // Go to the initial page
//     await page.goto('https://www.stadtbibliothek.oldenburg.de/olsuchergebnisse?p_p_id=searchResult_WAR_arenaportlet&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&_searchResult_WAR_arenaportlet__wu=%2FsearchResult%2F%3Fwicket%3Ainterface%3D%3A0%3AsearchResultPanel%3AdataContainer%3AdataView%3A1%3AcontainerItem%3Aitem%3AindexedRecordPanel%3AcoverDecorPanel%3AcoverLink%3A%3AILinkListener%3A%3A');
//     console.log("got to page")
//     // Wait for the records to load
//     await page.screenshot({ path: 'initial-page.png', fullPage: true })
//     await page.waitForSelector('img');
//     console.log("found page")
//     await page.screenshot({ path: 'initial-page2.png', fullPage: true })
//     // Click on the link to page 2
//     await page.click('.arena-page-number a[title="Zu Seite 2"]');
//     console.log("found page 2")
//     // Wait for the next page to load
//     await page.waitForNavigation();
//
//     // Extract data from the second page
//     const data = await page.evaluate(() => {
//         const elements = document.querySelectorAll('.arena-record');
//         return Array.from(elements).map(el => {
//             return {
//                 recordId: el.querySelector('.arena-record-id')?.innerText || '',
//                 title: el.querySelector('.arena-record-title a span')?.innerText || '',
//                 authors: Array.from(el.querySelectorAll('.arena-record-author .arena-value')).map(a => a.innerText),
//                 year: el.querySelector('.arena-record-year .arena-value')?.innerText || '',
//                 language: el.querySelector('.arena-record-language .arena-value')?.innerText.trim() || ''
//             };
//         });
//     });
//
//     console.log('Data from page 2:', data);
//
//     await browser.close();
// })();