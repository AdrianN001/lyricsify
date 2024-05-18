import axios, {AxiosResponse} from "axios"


export default async function SearchSongLyrics(api_key: string, title: string, artist: string ): Promise<string[]>{
    const response:AxiosResponse = await axios({
        method:'get',

        url: "http://lyricsify.onrender.com/fetch_lyrics",
        
        headers:{
            Authorization:api_key
        },
        params:{
            title,
            artist
        }
    })
    return response.data['lyrics'] ?? Promise.reject();
}

