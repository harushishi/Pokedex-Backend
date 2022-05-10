const mongoose = require('mongoose')
require('dotenv').config()

const MONGODB_URL = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PW}@cluster0.n1smb.mongodb.net/pokedex?retryWrites=true&w=majority`

console.log('connecting to', MONGODB_URL)

mongoose.connect(MONGODB_URL)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const pokemonSchema = new mongoose.Schema({
    name: String,
    description: String,
    height: Number,
    weight: Number,
    imageUrl: String,
    types: String,
})

pokemonSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Pokemon', pokemonSchema)