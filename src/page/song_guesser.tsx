import {useState, useEffect, useRef} from 'react';
import './song_guesser.css';
import {ReactComponent as RightSplash} from '../assets/right_splash.svg'
import {ReactComponent as LeftSplash} from '../assets/left_splash.svg'
import logo from "../assets/loading.gif"
import GameInterface from "../interface/game"
import {getTokenFromUrl} from "../backend/spotify";
import CreateNewGame from '../backend/song_guesser';
import Select from "react-select";
import SpotifyLoginButton from '../components/spotify_login';
import { isDisabled } from '@testing-library/user-event/dist/utils';

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
            
        }
        if (title == currentGame.title && titleInputRef.current){
            console.log("TITLE IS RIGHT")
        }
        if(artist == currentGame.artist && title == currentGame.title){
            window.alert("idk")
        }
        
    }, [artist,title])

    const refresh = () => {
        setLoaded(false)

        artistInputRef.current.clearValue();
        titleInputRef.current.clearValue();
        CreateNewGame(token).then(new_game => {
            setCurrentGame(new_game);


            setLoaded(true)
        }).catch(e => {
            console.error(e)
            // The spotify token is not valid
            window.location.reload()
        })
    }

    const isLoggedIn = () => token !== "";
    const isCorrectArtist = () => artist == currentGame.artist
    const isCorrectTitle = () => title == currentGame.title


    return (
        <div className="main-container">
        <div className="header">This is an open-source project. If you are interested, take a look a <a target="_blank" href={"https://github.com/AdrianN001/lyricsify"}>repo</a> and <span className='star'>star it</span></div>
        <div className="container">
            <h1 className="title">Guess the song by its lyrics</h1>
            {token == "" && <div className='lyrics-container'>Please, login to your spotify account to play</div> }
            {loaded && currentGame.lyrics.length == 0 && <div className='lyrics-container'>Sorry, something wrong has happend</div>}
            {loaded && currentGame.lyrics.length >= 1 && <div className='lyrics-container'>{currentGame.lyrics.map((value, index) => <div className="lyrics" key={index}>{value}</div>)}</div>}
            {!loaded && token != "" && <div className='lyrics-container'><img className="loading-gif" src={logo} /></div>} 
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
                className={isCorrectArtist() ? "correct-input-field": ""}
                isDisabled={isCorrectArtist()}
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
                className={isCorrectTitle() ? "correct-input-field": ""}
                isDisabled={isCorrectTitle()}
                />
            </div>
            <RightSplash className='rigthSplash' />
            <LeftSplash className='leftSplash' />
        {isLoggedIn() 
        ? 
            <button className='refresh-button' onClick={() => refresh()}>Refresh</button>
        : 
            <SpotifyLoginButton
            auth_endpoint={auth_endpoint}
            client_id={client_id}
            redirect_uri={redirect_uri}
            response_type={response_type}
            scopes={scopes.join("%20")}
            show_dialog={true}

            outerClass='' 
            />}
        </div>
        </div>
    );
}

export default SongGuesser;