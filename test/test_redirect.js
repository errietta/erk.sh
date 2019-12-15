const chai = require('chai')
const chaiHttp = require('chai-http')
const MongoClient = require('mongo-mock').MongoClient

const app = require('../server/app')


const { expect } = chai
chai.use(chaiHttp)

const mongodb = "URLShortener-test"

describe('Redirect', async () => {
  let db, server, agent

  before(async () => {
    const client = await MongoClient.connect(mongodb)
    db = client.db()
    server = await app(db, client)
    agent = chai.request.agent(server.app)

    await db.collection("urls").insertOne({
      "url": "https://www.errietta.me/blog",
      "slug": "blog",
    })
  })

  after(async () => {
    await db.collection("urls").deleteMany({})
    await Promise.all([
      agent.close(),
      db.close(),
      server.listener.close(),
    ])
  })

  beforeEach(async () => {
    await Promise.all([
      db.collection("users").deleteMany({}),
      db.collection("settings").deleteMany({}),
    ])
  })

  it('should redirect', async () => {
    const result = await agent.get("/blog")
    expect(result).to.redirectTo("https://www.errietta.me/blog")
  })

  it('should 404 if no slug', async () => {
    const result = await agent.get("/stuff")
    expect(result).to.have.status(404)
  })
})
