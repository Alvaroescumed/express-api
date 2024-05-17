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

//Necesitamos realizar este middleware para que se pueda leer el cuerpo de la peticion como json
app.use(express.json())

//conectamos con la base de datos

mongoose.connect('mongodb://localhost:27017/playlist')
    .then(()=> console.log('DB conncected succesfully'))
    .catch(err => console.log(err))

// desarrollamos las funciones que vamos a usar en la aplicacion

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

async function createPlaylist(playlistData){
    try{
        
        //Inicializamos la playlist a crear
        const newPlaylist = new PlaylistModel(playlistData)
        //guardamos la playlist en la base de datos
        await newPlaylist.save() 
        
        return newPlaylist

    } catch(error){

        console.error(error)
        return{error: error.message}

    }
}

async function addSong(playlistName, song){
    try{
        //Buscamos la playlist a la que queremos añadir la cancion
        const playlist = await PlaylistModel.findOne({ name: playlistName})

        //si esta existe añadimos la cancion y la guardamos, en caso de quen no salta un error
        if(playlist){
            playlist.songs.push(song)
            await playlist.save()

            return playlist
        } else{
            return {error: 'Playlist not found'}
        }
    } catch(error){
        console.error(error)
        return{error: error.message}
    }
}

async function deleteSong(playlistName, title){
    try{
        //comprobamos que la cancion que queremos borrar se encuentre en la playlist y que esta misma tambien exista
        const playlist = await PlaylistModel.findOne({ name: playlistName})
        const songIndex = playlist.songs.findIndex(song => song.title === title)

        if(playlist && songIndex > 0){
            playlist.songs.splice(songIndex, 1)
            await playlist.save()

            return playlist
        }

    }catch(error){
        console.error(error)
        return { error: error.message }
    }
}


//traemos las canciones mas escuchadas
app.get('/recent-tracks', async (req, res) => {
    const data = await fetchTopTracks();
    res.json(data)
});

// creamos una playlist vacia tomando como datos el body en la request
app.post('/create-playlist', async(req, res) => {
    const playlistData = req.body
    console.log(req.body)
    const playlist = await createPlaylist(playlistData)
    res.json(playlist)
})

//añadimos canciones a la playlist
app.put('/add-song', async(req, res) => {
    const {playlistName, title}  = req.body

    //traemos las canciones de la api
    const allSongs = await fetchTopTracks()

    // comprobamos que el nombre de la cancion que queremos añadir este en el resultado de la request de la API
    const song = allSongs.find(song => song.title === title)

    // creamos un condicional de que si existe la cancion la añada, sino que salte un error
    if(song){
        const updatePlaylist = await addSong(playlistName, song)
        res.json(updatePlaylist)
    } else{
        return {error: 'La cancion no es valida'}
    }
    
})

//borramos una cancion de la playlist
app.delete('/delete-song', async(req, res) => {
    const {playlistName, title}  = req.body

    const updatedPlaylist = await deleteSong(playlistName, title)

    res.json(updatedPlaylist)

})


app.listen( port, () => {
    console.log(`server listen at ${port}`)
} )