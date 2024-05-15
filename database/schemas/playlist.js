const mongoose = require('mongoose')

// creamos un esquema para la playlist

const PlaylistSchema = new mongoose.Schema({
    title: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    artist: {
        type:mongoose.SchemaTypes.Array, // ponemos opcion de array por si acaso el track tiene más de un artista
        required: true
    }
})

module.exports = mongoose.model('playlist', PlaylistSchema)
