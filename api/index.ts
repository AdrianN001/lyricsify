const express = require("express");
const cors = require("cors");
const FindLyrics = require("./genius.js");

const app = express();
app.use(cors())

const port = 5000;

app.get("/fetch_lyrics", async (req, res) => {
    const api_key = req.headers.authorization;
    const title = req.query['title']; 
    const artist = req.query['artist'];
    try{
        const lyrics = await FindLyrics(api_key ?? "", title, artist);
        res.json({lyrics});
    }catch(e){
        console.error(e)
        res.json({lyrics:[]});
    }
})

app.listen(port, () => {
  
    console.log("Server is running now");
})