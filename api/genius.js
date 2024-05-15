const axios = require("axios");
const jsdom = require("jsdom");
const {JSDOM} = jsdom;

const MAX_LINES_ALLOWED = 130;
/**
 * 
 * @param {string} api_key 
 * @param {string} title 
 * @param {string} artist 
 * @returns {Promise<string[]>}
 */
async function SearchSongLyrics(api_key, title, artist ){
    const id = await __getSongIdFromArtistAndTitle(api_key, artist, title);
    if (!id){
        return;
    }
    try{
        const lyrics = await __fetchSongLyricsById(id);
        return lyrics
    }catch(e){
        return [];
    }
}

/**
 * 
 * @param {string} api_key 
 * @param {string} songId 
 * @returns {Promise<string[]>}
 */
async function __fetchSongLyricsById(songId){
    try{
        const response  = await axios.get(`https://genius.com/songs/${songId}`)
        const html_page = response.data;
        const lyrics = __parseWebsite(html_page);
        if(lyrics.length >= MAX_LINES_ALLOWED){
            /* Possibly not a song lyrics, but a whole tale */
            return Promise.reject("Not a proper song lyric")
        }
        return lyrics;
    }catch (error) {
        console.error('Error fetching song lyrics: ', error);
        return Promise.reject()
    }
}
/**
 * 
 * @param {string} line 
 * @returns {boolean}
 */
const filter_line = (line) => {
    return !line.startsWith("[")
}

/**
 * 
 * @param {string} websiteHtml
 * @returns {string[]} 
 */
function __parseWebsite(websiteHtml){
    const {document} = new JSDOM(websiteHtml).window;
    const tags = document.querySelectorAll('[data-lyrics-container="true"]')
    let lyrics = []
    tags.forEach(value => {
        const sub_lyics =  value.innerHTML.split("<br>");
        sub_lyics.forEach(line => {
            if (filter_line(line)){
                const current_line = line;
                const line_without_html_tag = removeHTMLTags(current_line)
                lyrics.push(line_without_html_tag)
            }
        })
    })
    console.log(lyrics)
    return lyrics
    
}
function removeHTMLTags(html) {
    return html.replace(/<[^>]*>/g, '');
}

/**
 * 
 * @param {string} api_key 
 * @param {string} artist 
 * @param {string} title 
 * @returns {Promise<number>}
 */
async function __getSongIdFromArtistAndTitle(api_key, artist, title){
    const title_2 = RemoveParenthesis(title);
    try{
        console.log(`https://api.genius.com/search?q=${artist.replaceAll(" ", "%20")}%20${title_2.replaceAll(" ", "%20")}&access_token=${api_key}`)
        const response = await axios.get(`https://api.genius.com/search?q=${artist.replaceAll(" ", "%20")}%20${title_2.replaceAll(" ", "%20")}&access_token=${api_key}`)
        const firstResult = response.data['response']['hits'][0];
        if(firstResult){
            const songID = firstResult['result']['id'];
            return songID
        }
        console.log(response.data);
        return Promise.reject("There was no first result")

    }catch (error) {
        return Promise.reject("Error at the fetching")
    }
}

const RemoveParenthesis = (title) => title.replace(/\([^>]*\)/g, '')

module.exports = SearchSongLyrics 