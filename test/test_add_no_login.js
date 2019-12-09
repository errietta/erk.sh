const chai = require('chai')
const chaiHttp = require('chai-http')
const MongoClient = require('mongo-mock').MongoClient

const app = require('../server/app')

const { expect } = chai
chai.use(chaiHttp)

const mongodb = "URLShortener-test"

describe('Add URL', async () => {
  let db, server, agent

  before(async () => {
    const client = await MongoClient.connect(mongodb)
    db = client.db()
    server = await app(db, client)
    agent = chai.request.agent(server.app)
  })

  after(async () => {
    await agent.close()
    await server.listener.close()
    await db.close()
  })

  beforeEach(async () => {
    await Promise.all([
      db.collection("users").deleteMany({}),
      db.collection("settings").deleteMany({}),
      db.collection("urls").deleteMany({})
    ])
  })

  it('should decline non-logged in user', async () => {
    const result = await agent.post("/add")
    expect(result.body).to.be.an('object')
    expect(result.body).to.have.property('error').equal('not logged in')
  })
})
