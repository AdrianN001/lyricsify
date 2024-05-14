import axios, {AxiosResponse} from "axios"


export default async function SearchSongLyrics(api_key: string, title: string, artist: string ): Promise<string[] | void>{
    const response:AxiosResponse = await axios({
        method:'get',

        url: "http://localhost:5000/fetch_lyrics",
        
        headers:{
            Authorization:api_key
        },
        params:{
            title,
            artist
        }
    })
    return response.data['lyrics'];
}

