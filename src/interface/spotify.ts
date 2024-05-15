
interface AuthUrlResponseObject{
    access_token: string,
    token_type: string, 
    expires_in: string
}

interface SpotifyLoginButtonProps{
    auth_endpoint: string
    client_id: string
    redirect_uri: string
    response_type: string
    scopes: string
    show_dialog:boolean


    outerClass: string 
}

interface Song{
    artist: string
    title: string
}

export type {AuthUrlResponseObject, Song, SpotifyLoginButtonProps};