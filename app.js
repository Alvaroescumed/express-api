//importamos los paquetes de express, axios, mongoose. Ademas traemos el archivo config y database
const mongoose = require('mongoose')
const express = require('express')
const axios = require('axios')
const config = require('./config')
const PlaylistModel = require('./database/schemas/playlist')

//creamos la app usando express y router para enrutar las funciones de la aplicacion
const app = express()   
const port = 3000

const apiKey = config.apiKey

//conectamos con la base de datos

mongoose.connect('mongodb://localhost:27017/tutorial')
    .then(()=> console.log('Conncected succesfully'))
    .catch(err => console.log(err))

async function fetchTopTracks(){
    try{
        const response = await axios.get(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks`, {
            params : {
                limit: 10,
                user: 'Grekkh',
                api_key: apiKey,
                format: 'json'
            },
             headers : {
                'Content-Type': 'application/json'
            }, 
        });

        // filtramos la respuesta para que solo se muestre 
        const filteredRes = response.data.recenttracks.track.map(track => ({
            title: track.name,
            artist: track.artist['#text']

         }))
        return filteredRes;
        
    
    }catch (error){
        console.error(error);
        return{ error: error.message}
    }
}




//traemos las canciones mas escuchadas
app.get('/recent-tracks', async (req, res) => {
    const data = await fetchTopTracks();
    res.json(data)
});

app.post('/create-playlist', async(req, res) => {
    const data = await createPlaylist()
    res.json(data)
})



app.listen( port, () => {
    console.log(`server listen at ${port}`)
} )