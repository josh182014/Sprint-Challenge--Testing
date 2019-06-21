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
        it('should return status 405 if game title already exists', async () => {
            const newGame = { title: "Another Game", genre: "action", releaseYear: 2019}
            const newGame2 = { title: "Another Game", genre: "adventure", releaseYear: 2015}
            const gameArray = [
                {...newGame, id: 1},
                {...newGame2, id: 2}
            ]
            await supertest(server)
                .post('/api/games')
                .send(newGame)
            const whatever = await supertest(server)
                .post('/api/games')
                .send(newGame2)
                const games = await supertest(server)
                .get('/api/games')
            expect(games.status).toBe(200)
            console.log(games.body)
            expect(whatever.status).toBe(405)
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

    describe('GET by id', () => {
        it('returns a game by id', async () => {
            const newGame = { title: "Another Game", genre: "action", releaseYear: 2019}
            const newGame2 = { title: "Awesome Game", genre: "adventure", releaseYear: 2015}
            await supertest(server)
                .post('/api/games')
                .send(newGame)
            await supertest(server)
                .post('/api/games')
                .send(newGame2)
            const games = await supertest(server)
                .get('/api/games/2')
            expect(games.body.id).toEqual(2)
        })

        it('returns 404 if no game for that id' , async () => {
            const newGame = { title: "Another Game", genre: "action", releaseYear: 2019}
            const newGame2 = { title: "Awesome Game", genre: "adventure", releaseYear: 2015}
            await supertest(server)
                .post('/api/games')
                .send(newGame)
            await supertest(server)
                .post('/api/games')
                .send(newGame2)
            const games = await supertest(server)
                .get('/api/games/3')
            expect(games.status).toBe(404)
        })
    })

    describe('DEL by id', () => {
        it('deletes a game by id', async () => {
            const newGame = { title: "Another Game", genre: "action", releaseYear: 2019}
            const newGame2 = { title: "Awesome Game", genre: "adventure", releaseYear: 2015}
            await supertest(server)
                .post('/api/games')
                .send(newGame)
            await supertest(server)
                .post('/api/games')
                .send(newGame2)
            const games = await supertest(server)
                .del('/api/games/2')
            expect(games.body).toEqual(1)
            const getGame = await supertest(server)
                .get('/api/games')
            expect(getGame.body[0].id).toEqual(1)
        })

        it('returns 404 if no game for that id' , async () => {
            const newGame = { title: "Another Game", genre: "action", releaseYear: 2019}
            const newGame2 = { title: "Awesome Game", genre: "adventure", releaseYear: 2015}
            await supertest(server)
                .post('/api/games')
                .send(newGame)
            await supertest(server)
                .post('/api/games')
                .send(newGame2)
            const games = await supertest(server)
                .del('/api/games/3')
            expect(games.status).toBe(404)
        })
    })
})