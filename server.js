const express = require('express');
const db = require('./data/dbConfig')

const server = express();
server.use(express.json());

const gameCheck = async (req, res, next) => {
    const newGame = req.body.title
    const games = await db('games')
    if (games) {
        titles = []
        games.forEach(function(each) {
            titles.push(each.title)
        })
        if (titles.includes(newGame)) {
            res.status(405).json('Game already exists!')
        }
        else {
            next()
        }
    }
    else {
        next()
    }
}

server.get('/', (req, res) => {
  res.status(200).json('ITS WORKING');
});

server.get('/api/games', (req, res) => {
    db('games')
    .then(response => {
        res.status(200).json(response)
    })
    .catch(error => {
        res.status(500).json(error)
    })
})

server.post('/api/games', gameCheck, (req, res) => {
    if(!req.body.title || !req.body.genre) {
        res.status(422).json("Incomplete Information")
    }
    else {
        db('games').insert(req.body)
        .then(response => {
            res.status(201).json(response)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }
})

server.get('/api/games/:id', (req, res) => {
    const id = req.params.id
    db('games')
    .where({id})
    .first()
    .then(response => {
        if(response) {
            
            res.status(200).json(response)
        }
        else {
            res.status(404).json("Game Not Found")
        }
    })
    .catch(error => {
        res.status(500).json(error)
    })
})

server.delete('/api/games/:id', (req, res) => {
    const id = req.params.id
    db('games')
    .where({id})
    .first()
    .del()
    .then(response => {
        if(response) {
            
            res.status(200).json(response)
        }
        else {
            res.status(404).json("Game Not Found")
        }
    })
    .catch(error => {
        res.status(500).json(error)
    })
})

module.exports = server;
