import axios from "axios";
import {AuthUrlResponseObject, Song} from "../interface/spotify"
import randInt from "../utils/random"


async function fetchUserSavedTracks(token: string, offset: number,limit: number): Promise<Song[]>{

    const {data} = await axios.get(`https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`, {
        headers:{
            'Authorization': `Bearer ${token}`
        }
    })
    const songs = data["items"];
    const flattenSongs = flattenTrackObjects(songs);

    return flattenSongs
}


function flattenTrackObjects(tracks: object[]): Song[]{
    return tracks.map((track:any) => {
        const artist = track['track']['artists'][0]['name'];
        const title = track['track']['name'];

        return {
            artist,
            title
        };
    })
}
/* Best way to use TypeScript <3 */
function getTokenFromUrl(): any{
    //@ts-ignore
    return window.location.hash.substring(1).split("&").reduce((initial: string, item: string) => {
        let parts = item.split("=");
        //@ts-ignore
        initial[parts[0]]= decodeURIComponent(parts[1]);
        
        return initial;
    //@ts-ignore
    }, {})
}

export default fetchUserSavedTracks;
export {getTokenFromUrl};