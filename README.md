# Lyricsify

![Screenshot of the app](https://raw.githubusercontent.com/AdrianN001/lyricsify/main/assets/app_screenshot.png)

## Setup
The game only relies on two API services, the Spotify API, and the Genius API. Their credentials are stored in a .env file, which looks like the following <br />
```
REACT_APP_GENIUS_API_KEY=YOUR_GENIUS_API_KEY

REACT_APP_SPOTIPY_CLIENT_ID=YOUR_SPOTIFY_APP_CLIENT_ID
REACT_APP_SPOTIPY_CLIENT_SECRET=YOUR_SPOTIFY_APP_CLIENT_SECRET
REACT_APP_SPOTIPY_REDIRECT_URI=YOUR_SPOTIFY_APP_REDIRECT_URI  #usually something like http://localhost:3030

REACT_APP_BACKEND_URL=THE_URL_OF_THE_BACKEND_SERVER           #usually something like http://localhost:5000
```
<br />
The game also relies on a backend server, which was written in express.js. You can find the other repository at https://github.com/AdrianN001/Lyricsify-api
<br />

## Limitation
Unfortunatly, due to [Spotify's policy](https://developer.spotify.com/policy#iii-some-prohibited-applications) it is unfeasible to exit from the developer mode of the project, and therefore to publish the website.
