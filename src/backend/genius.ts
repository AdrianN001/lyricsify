import axios, {AxiosResponse} from "axios"


export default async function SearchSongLyrics(api_key: string, title: string, artist: string ): Promise<string[]>{
    const backend_url = process.env['REACT_APP_BACKEND_URL'] ?? ""
    const response:AxiosResponse = await axios({
        method:'get',

        url: `${backend_url}/fetch_lyrics`,
        
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

