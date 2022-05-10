require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

// mongodb setup, now in pokemon.js and .env //
const Pokemon = require('./models/pokemon')
//                                          //
app.use(cors())

//show all pokemons
app.get('/api/pokemons', (request, response) => {
    Pokemon.find({}).then(pokemons => {
        response.json(pokemons)
    })
})
//show a pokemon given it's name on the url //
app.get('/api/pokemons/:name', (request, response) => {
    const name = request.params.name
    Pokemon.findOne({ name: name }).then(pokemon => {
        if (pokemon) {
            response.json(pokemon)
        } else {
            response.status(404).end()
        }
    })
        .catch(error => {
            console.log(error)
            response.status(500).end()
        })
})
//         //

//add a new pokemon to DB w/ a post req//
app.use(express.json());
app.post('/api/pokemons', (request, response) => {
    const body = request.body
    console.log(body)

    if (body.name === undefined || body.name === "") {
        return response.status(400).json({ error: 'Pokemon missing' })
    }

    Pokemon.findOne({ name: body.name }).then(pokemon => {
        if (pokemon) {
            return response.status(400).json({ error: 'Pokemon already exists' })
        } else {
            const pokemon = new Pokemon({
                name: body.name,
                description: body.description,
                height: body.height,
                weight: body.weight,
                imageUrl: body.imageUrl,
                types: body.types
            })

            pokemon.save().then(savedPokemon => {
                response.json(savedPokemon)
            })
        }
    })
})
//                 //                  //
// delete desired pokemon from db given it's ID //
app.delete('/api/pokemons/:id', (request, response, next) => {
    Pokemon.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})
// updated desired pokemon from db given it's ID //
// Should NOT let you change it's name, since pokemon is ID bounded. //
app.put('/api/pokemons/:id', (request, response, next) => {
    const body = request.body
    console.log(body)
    const pokemon = {
        name: body.name,
        description: body.description,
        height: body.height,
        weight: body.weight,
        imageUrl: body.imageUrl,
        types: body.types
    }

    Pokemon.findByIdAndUpdate(request.params.id, pokemon, { new: true })
        .then(updatedPokemon => {
            response.json(updatedPokemon)
        })
        .catch(error => next(error))
})
//                      //                      //

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
