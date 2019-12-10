const bcrypt = require('bcrypt')
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

    const hashedPassword = await bcrypt.hash('correct', 10)

    await db.collection('users').insertOne({
      "username": "erry",
      "password": hashedPassword
    })

    await agent.post("/login").send({ "username": "erry", "password": "correct" })
  })

  after(async () => {
    await db.collection("users").deleteMany({}),
    await Promise.all([
      agent.close(),
      db.close(),
      server.listener.close(),
    ])
  })

  beforeEach(async () => {
    await Promise.all([
      db.collection("settings").deleteMany({}),
      db.collection("urls").deleteMany({})
    ])
  })

  it('should add url', async () => {
    const result = await agent.post("/add").send({
      "url": "http://www.errietta.me/",
    })
    expect(result.body).to.be.an('object')
    expect(result.body).to.have.property('success').equal(true)
    expect(result.body).to.have.property('slug').equal('1')
  })

  it('should add url with slug', async () => {
    const result = await agent.post("/add").send({
      "url": "http://www.errietta.me/",
      "slug": "erry",
    })
    expect(result.body).to.be.an('object')
    expect(result.body).to.have.property('success').equal(true)
    expect(result.body).to.have.property('slug').equal('erry')
  })

  it('should return error if slug exists', async () => {
    let result = await agent.post("/add").send({
      "url": "http://www.errietta.me/",
      "slug": "erry",
    })
    expect(result.body).to.have.property('success').equal(true)

    result = await agent.post("/add").send({
      "url": "http://www.errietta.me/",
      "slug": "erry",
    })
    expect(result.body).to.have.property('error').equal('slug already exists')
  })

  it('should return error if url invalid', async () => {
    let result = await agent.post("/add").send({
      "url": "nope",
      "slug": "erry",
    })

    expect(result.body).to.have.property('error').equal('not a valid url')
  })
})
