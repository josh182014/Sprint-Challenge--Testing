const express = require('express');
const db = require('./data/dbConfig')

const server = express();
server.use(express.json());

server.get('/', (req, res) => {
  res.status(200).json('ITS WORKING');
});

server.get('/api/games', (req, res) => {
    db('games')
    .then(response => {
        console.log(response)
        res.status(200).json(response)
    })
    .catch(error => {
        console.log(error)
        res.status(500).json(error)
    })
})

server.post('/api/games', (req, res) => {
    if(!req.body.title || !req.body.genre) {
        res.status(422).json("Incomplete Information")
    }
    db('games').insert(req.body)
    .then(response => {
        console.log(response)
        res.status(201).json(response)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

module.exports = server;
