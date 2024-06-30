const axios = require('axios');
const cheerio = require('cheerio');


async function getMoreData(url) {
    try {
        let response = await axios.get(url);
        const $ = cheerio.load(response.data);

        //console.log(response.data);

        const holdingNotes = $('.arena-holding-note');
        console.log(`Found ${holdingNotes.length} .arena-holding-note elements`);

        holdingNotes.each((index, el) => {
            const field = $(el).find('.arena-field').text().trim();
            console.log(`Field text: ${field}`); // Log the field text to verify

            if (field === 'Mediennummer:') {
                const mediennummer = $(el).find('.arena-value').text().trim();
                console.log(`Mediennummer: ${mediennummer}`); // Log the Mediennummer
            }
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

getMoreData("https://www.stadtbibliothek.oldenburg.de/olkatalogdatensatz?p_p_id=crDetailWicket_WAR_arenaportlet&p_p_lifecycle=1&p_p_state=normal&p_r_p_arena_urn%3Aarena_search_item_id=8260693&p_r_p_arena_urn%3Aarena_facet_queries=&p_r_p_arena_urn%3Aarena_agency_name=ADEOLDENBURG&p_r_p_arena_urn%3Aarena_search_item_no=0&_crDetailWicket_WAR_arenaportlet_back_url=https%3A%2F%2Fwww.stadtbibliothek.oldenburg.de%2Folsuchergebnisse%3Fp_p_id%3DsearchResult_WAR_arenaportlet%26p_p_lifecycle%3D1%26p_p_state%3Dnormal%26p_r_p_arena_urn%253Aarena_facet_queries%3D%26_searchResult_WAR_arenaportlet_agency_name%3DADEOLDENBURG%26p_r_p_arena_urn%253Aarena_search_item_no%3D0%26p_r_p_arena_urn%253Aarena_search_query%3Dexilium%26p_r_p_arena_urn%253Aarena_search_type%3Dsolr%26p_r_p_arena_urn%253Aarena_sort_advice%3Dfield%253DpublicationDate_sort%2526direction%253DDescending%26_searchResult_WAR_arenaportlet_arena_member_id%3D497914088&p_r_p_arena_urn%3Aarena_search_query=exilium&p_r_p_arena_urn%3Aarena_search_type=solr&p_r_p_arena_urn%3Aarena_sort_advice=field%3DpublicationDate_sort%26direction%3DDescending&p_r_p_arena_urn%3Aarena_arena_member_id=497914088");