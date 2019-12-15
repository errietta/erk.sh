const bcrypt = require('bcrypt')
const chai = require('chai')
const chaiHttp = require('chai-http')
const MongoClient = require('mongo-mock').MongoClient

const app = require('../server/app')


const { expect } = chai
chai.use(chaiHttp)

const mongodb = "URLShortener-test"

describe('List URL', async () => {
  let db, server, agent

  before(async () => {
    const client = await MongoClient.connect(mongodb)
    db = client.db()
    server = await app(db, client)
    agent = chai.request.agent(server.app)

    const hashedPassword = await bcrypt.hash('correct', 10)

    await db.collection('users').insertOne({
      "username": "erry",
      "password": hashedPassword
    })

    await agent.post("/login").send({ "username": "erry", "password": "correct" })

    await agent.post("/add").send({
      "url": "http://www.errietta.me/",
    })
    await agent.post("/add").send({
      "url": "http://www.example.com/",
    })
  })

  after(async () => {
    await Promise.all([
      db.collection("urls").deleteMany({}),
      db.collection("users").deleteMany({}),
      db.collection("settings").deleteMany({}),
    ])
    await Promise.all([
      agent.close(),
      db.close(),
      server.listener.close(),
    ])
  })

  it('should list urls', async () => {
    const result = await agent.get("/list")
    expect(result.body).to.be.an('object')
    expect(result.body).to.have.property('success').equal(true)
    expect(result.body).to.have.property('items').deep.equal(
      [
        {
          "url": "http://www.errietta.me/",
          "slug": "1",
        },
        {
          "url": "http://www.example.com/",
          "slug": "2"
        }
      ]
    )
  })
})
