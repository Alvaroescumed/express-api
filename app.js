//importamos los paquetes de express y mongoose
const express = require('express')
const axios = require('axios')
const token = 'BQDl51_hALAJPpDW0jLn8hVUAMxhqQM1mqopDtg4T0ww8sH78lfVuO3FXyrUu8GlIBt5UnqI_2U40WwVCqPkkYW9zMG0HpIOtZm7avV7y1Fla9D_VJkmW8ZJpFoPfIc91FcDw5fsIoirX05tz1pV9KOr8H5z_DyvXMgSGSEzP8vUNw_9J-PRsFDrKqz0Bc4Sfdd7iQOIbafJdY0VrD9s8nB6xwKcyjXAzFikhvw8ihXVL8dZVLYP8x0ngSqzV4zw'

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



//traemos las canciones mas escuchadas
app.get('/top-albums', async (req, res) => {
    const data = await fetchTopTracks();
    res.json(data)
});



app.listen( port, () => {
    console.log(`server listen at ${port}`)
} )