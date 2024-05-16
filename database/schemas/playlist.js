const mongoose = require('mongoose')

// creamos un esquema para las canciones

const SongSchema = new mongoose.Schema({

    title: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    artist: {
        type:mongoose.SchemaTypes.Array, // ponemos opcion de array por si acaso el track tiene más de un artista
        required: true
    }

})

// creamos un esquema para la playlist

const PlaylistSchema = new mongoose.Schema({

    name: {
        type: mongoose.SchemaTypes.String,
        required: true  
    },
    description: {
        type: mongoose.SchemaTypes.String,
        required: false  
    },
    songs: [SongSchema]
})

module.exports = mongoose.model('playlist', PlaylistSchema)
