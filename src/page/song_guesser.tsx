import {useState, useEffect, useRef} from 'react';
import './song_guesser.css';
import GameInterface from "../interface/game"
import {getTokenFromUrl} from "../backend/spotify";
import SpotifyWebApi from "spotify-web-api-js";
import CreateNewGame from '../backend/song_guesser';
import Select from "react-select";

const scopes = ["user-library-read"]
const client_id = process.env.REACT_APP_SPOTIPY_CLIENT_ID ?? ""
const redirect_uri = process.env.REACT_APP_SPOTIPY_REDIRECT_URI ?? ""
const auth_endpoint = "https://accounts.spotify.com/authorize"
const response_type = "token"

function SongGuesser() {

    const [token, setToken] = useState<string>("");


    const [artist, setArtist] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [loaded, setLoaded] = useState<boolean>(false);

    const [currentGame, setCurrentGame] = useState<GameInterface>({} as GameInterface);

    const artistInputRef = useRef<any>(null);
    const titleInputRef = useRef<any>(null);

    useEffect(() => {
        setLoaded(false)
        const url_data = getTokenFromUrl();
        const acces_token = url_data["access_token"];

        if(acces_token){
            setToken(acces_token);
            
            CreateNewGame(acces_token).then(new_game => {
                setCurrentGame(new_game)
                setLoaded(true);
            })
            window.location.hash = "";
        }
    }, [])

    useEffect(() => {
        if (artist == currentGame.artist && artistInputRef.current){
            console.log("ARTIST IS RIGHT")
            artistInputRef.current.isDisabled = true;
        }
    }, [artist])
    useEffect(() => {
        if (title == currentGame.title && titleInputRef.current){
            console.log("TITLE IS RIGHT")
            titleInputRef.current.isDisabled = true;

        }
    }, [title])

    const refresh = () => {
        setLoaded(false)

        artistInputRef.current.clearValue();
        titleInputRef.current.clearValue();
        CreateNewGame(token).then(new_game => {
            setCurrentGame(new_game);


            setLoaded(true)
        }).catch(e => {
            // The spotify token is not valid
            window.location.reload()
        })
    }


    return (
        <div className="main-container">
        <h1>Lyricsify</h1>
        {token == "" && <a href={`${auth_endpoint}?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scopes.join("%20")}&show_dialog=true`} >Login</a>}
        <div className="container">
            {loaded && currentGame.lyrics.length == 0 && <div className='lyrics-container'>Sorry, something wrong has happend</div>}
            {loaded && currentGame.lyrics ? <div className='lyrics-container'>{currentGame.lyrics.map((value, index) => <div className="lyrics" key={index}>{value}</div>)}</div> : <div className='lyrics-container'>Loading...</div>} 
            <div>Your guess:</div>
            <div className="input_fields">
                <Select  onChange={e => {
                    if (e != null){
                        //@ts-ignore
                        setArtist(e['value'])
                    }
                }} options={currentGame.possible_artists} 
                ref={artistInputRef}
                blurInputOnSelect={true}
                placeholder={"Artist"}
                />
                
                <br/>

                <Select onChange={e => {
                    if (e != null){
                        //@ts-ignore
                        setTitle(e['value'])
                    }
                }} options={currentGame.possible_titles} 
                ref={titleInputRef}
                placeholder={"Title"}
                blurInputOnSelect={true}
                />
            </div>
        {token && <button onClick={() => refresh()}>Retry</button>}
        </div>
        </div>
    );
}

export default SongGuesser;