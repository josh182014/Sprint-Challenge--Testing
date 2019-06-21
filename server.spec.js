const supertest = require('supertest');
const server = require('./server');
const db = require('./data/dbConfig');

afterEach(async () => {
    await db('games').truncate()
})


describe('games', () => {
    describe('post', () => {
        it('should post a new game', async () => {
            const newGame = await supertest(server)
                .post('/api/games')
                .send({ title: "Cool Game", genre: "action", releaseYear: 2019})
            expect(newGame.status).toBe(201)
            expect(newGame.body).toEqual([1])
        })

        it("should return 422 if it doesn't receive all needed information", async () => {
            const error = await supertest(server)
                .post('/api/games')
                .send({ title: "New Game"})
            expect(error.status).toBe(422)
        })
        it('should allow you to post without release year', async () => {
            const newGame = await supertest(server)
                .post('/api/games')
                .send({ title: "Cyberpunk 2077", genre: "open world" })
            expect(newGame.status).toBe(201)
        })
    })

    describe('GET', () => {
        it('should return status of 200', async () => {
            const games = await supertest(server)
            .get('/api/games')
            expect(games.status).toBe(200)
        })
        it('should return array of games', async () => {
            const newGame = { title: "Another Game", genre: "action", releaseYear: 2019}
            const newGame2 = { title: "Awesome Game", genre: "adventure", releaseYear: 2015}
            const gameArray = [
                {...newGame, id: 1},
                {...newGame2, id: 2}
            ]
            await supertest(server)
                .post('/api/games')
                .send(newGame)
            await supertest(server)
                .post('/api/games')
                .send(newGame2)
            const games = await supertest(server)
                .get('/api/games')
            expect(games.status).toBe(200)
            expect(games.body).toEqual(gameArray)
        })
        it('should return an empty array if there are no games', async () => {
            games = await supertest(server)
                .get('/api/games')
            expect(games.body).toEqual([])
        })
    })
})