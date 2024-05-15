import "./spotify_login.css"
import { SpotifyLoginButtonProps } from "../interface/spotify"

export default function SpotifyLoginButton({ outerClass, auth_endpoint, client_id, redirect_uri, response_type, scopes, show_dialog}: SpotifyLoginButtonProps){
    const link = `${auth_endpoint}?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scopes}&show_dialog=${show_dialog}` 

    return(<div className={outerClass}>
        <button className="spotify-login" onClick={()=>window.location.href=link} >Sign in with Spotify</button>
    </div>)
}