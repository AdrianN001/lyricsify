import fetchUserSavedTracks, * as spotify from "./spotify"
import Game from "../interface/game"; 
import SearchSongLyrics from "./genius";
import randInt from "../utils/random";
import GameInterface from "../interface/game";

const MAX_LINES = 6;

async function CreateNewGame(spotify_token: string): Promise<Game> {
    let possible_songs = await fetchUserSavedTracks(spotify_token, randInt(0, 300), 20);
    
    let actual_song_to_guess = possible_songs[randInt(0, possible_songs.length)];

    const lyrics = await SearchSongLyrics(process.env.REACT_APP_GENIUS_API_KEY ?? "", actual_song_to_guess.title, actual_song_to_guess.artist);
    if (!lyrics){
        return Promise.reject()
    }
    const start_index = randInt(0, lyrics.length - MAX_LINES);
    const end_index = start_index + MAX_LINES;

    const possisble_artists_set = [...new Set(possible_songs.map(song => song.artist))]
    const possisble_titles_set = [...new Set(possible_songs.map(song => song.title))]

    
    const sliced_lyric = lyrics.slice(start_index, end_index);

    const new_game: GameInterface = {
        lyrics: sliced_lyric.map(line => line == "" ? " ": line),
        artist: actual_song_to_guess.artist,
        title:actual_song_to_guess.title,
        hint: [],
        possible_artists: possisble_artists_set.map(song =>{ 
            return {
                "value": song, 
                "label": song
            }
        }),
        possible_titles: possisble_titles_set.map(song =>{ 
            return {
                "value": song, 
                "label": song
            }
        })
    }
    console.log(new_game)
    return new_game 
}




export default CreateNewGame;