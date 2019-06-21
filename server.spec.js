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
            expect(newGame.text).toBe("[1]")
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
        it('should return list of games in database', async () => {
            const games = await supertest(server)
            .get('/api/games')
            expect(games.status).toBe(200)
        })
        it('should return status 200', async () => {
            const newGame = { title: "Another Game", genre: "cool", releaseYear: 2019}
            await supertest(server)
            .post('/api/games')
            .send(newGame)
            const games = await supertest(server)
            .get('/api/games')
            expect(games.status).toBe(200)
        })
        it('should return an empty array if there are no games', async () => {
            games = await supertest(server)
            .get('/api/games')
            expect(games.text).toBe("[]")
        })
    })
})