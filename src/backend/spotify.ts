import axios from "axios";
import {AuthUrlResponseObject, Song} from "../interface/spotify"


async function fetchUserSavedTracks(token: string, offset: number,limit: number): Promise<Song[]>{
    try{
        const {data} = await axios.get(`https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`, {
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
        const songs = data["items"];
        const flattenSongs = flattenTrackObjects(songs);
        if(flattenSongs.length == 0){
            /* The offset was out of bound */
            return fetchUserSavedTracks(token, offset-50 ,limit)
        }
        return flattenSongs
    }catch(e){
        console.error(e)
        return Promise.reject();
    }
   
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