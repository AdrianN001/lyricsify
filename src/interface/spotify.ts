
interface AuthUrlResponseObject{
    access_token: string,
    token_type: string, 
    expires_in: string
}

interface Song{
    artist: string
    title: string
}

export type {AuthUrlResponseObject, Song};