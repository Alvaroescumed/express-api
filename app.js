//importamos los paquetes de express y mongoose
const express = require('express')
const axios = require('axios')
const token = 'BQCxH2y-SD3IGifq5V9shyGrpNXJmmkYyQHx0ARfCleEkblQ-sNdROBdl-JpyzZJn7xyF9xXJtUwU4JTyqAui-Lutsd2onjGi2YJ5qdOVY3YZiq0PYEd6nYhNL24PhM_Z2V9-4tgHHMiD6gZc13Tkz-zzAf0fMGcIV6itpJ9ZTgDz-mhptNkCamFx47NA_enhY4H2QMcLMN7dlg8_8csKVOReUgY2cICvkk83JGYaB6NX3e2Cc5vcjaY9mGyqurW'

//creamos la app usando express y router para enrutar las funciones de la aplicacion
const app = express()
const port = 3000

async function fetchTopTracks(){
    try{
        const response = await axios.get(`https://api.spotify.com/v1/me/top/tracks`, {
            params : {
                time_range: 'short_term',
                limit: 5
            },
             headers : {
                'Authorization' : `Bearer ${token}`,
                'Content-Type': 'application/json'
            }, 
        });

        // filtramos la respuesta para que solo se muestre 
        const filtered_res = response.data.items.map(album => ({
            name: album.name,
            // ya que artist es un array lo mapeamos para sacar los artistas de cada tema 
            artist: album.artists.map(artist => artist.name)
        }))
        return filtered_res;
        
    
    }catch (error){
        console.error(error);
        return{ error: error.message}
    }
}

async function createPlaylist(){
    try{
        const response = await axios.post('https://api.spotify.com/v1/users/aspot30/playlists', {
            headers : {
                'Authorization' : `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: {
                "name": "Res Api Playlist",
                "description": "Playlist creada con Res API ",
                "public": true
            }
        })

        return response.data;

    }catch(error){
        console.error(error)
        return{error: error.message}
    }

}



//traemos las canciones mas escuchadas
app.get('/top-albums', async (req, res) => {
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