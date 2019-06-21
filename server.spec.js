const supertest = require('supertest');
const server = require('./server');
const db = require('./data/dbConfig');

afterEach(async () => {
    await db('games').truncate()
})

// describe('server', () => {
//     it('should return true', () => {
//         expect(true).toBe(true)
//     })
// })

describe('games', () => {
    describe('post', () => {
        it('should post a new game', async () => {
            const newGame = await supertest(server)
            .post('/api/games')
            .send({ title: "Cool Game", genre: "action", realeaseYear: 2019})
            expect(newGame.status).toBe(200)
        })

        it("should return 422 if it doesn't receive all needed information", async () => {
            const error = await supertest(server)
            .post('/api/games')
            .send({ title: "New Game"})
            expect(error.status).toBe(422)
        })
    })

    describe('GET', () => {
        it('should return 200', async () => {
            const games = await supertest(server)
            .get('/api/games')
            expect(games.status).toBe(200)
        })
    })
})