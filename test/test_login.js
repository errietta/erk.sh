const bcrypt = require('bcrypt')
const chai = require('chai')
const chaiHttp = require('chai-http')
const MongoClient = require('mongo-mock').MongoClient

const app = require('../server/app')


const { expect } = chai
chai.use(chaiHttp)

const mongodb = "URLShortener-test"

describe('Login', async () => {
  let db, server, agent

  before(async () => {
    const client = await MongoClient.connect(mongodb)
    db = client.db()
    server = await app(db, client)
    agent = chai.request.agent(server.app)
  })

  beforeEach(async () => {
    await Promise.all([
      db.collection("users").deleteMany({}),
      db.collection("settings").deleteMany({}),
      db.collection("urls").deleteMany({})
    ])
  })

  it('should decline empty login', async () => {
    const result = await agent.post("/login")
    expect(result.body).to.be.an('object')
    expect(result.body).to.have.property('error').equal('username and password must be given')
  })

  it('should decline empty username', async () => {
    const result = await agent.post("/login").send({ 'password': 123 })
    expect(result.body).to.be.an('object')
    expect(result.body).to.have.property('error').equal('username and password must be given')
  })

  it('should decline empty password', async () => {
    const result = await agent.post("/login").send({ 'username': 'hi' })
    expect(result.body).to.be.an('object')
    expect(result.body).to.have.property('error').equal('username and password must be given')
  })

  it('should decline incorrect login', async () => {
    const result = await agent.post("/login").send({ "username": "erry", "password": "nope" })
    expect(result.body).to.be.an('object')
    expect(result.body).to.have.property('error').equal('username or password incorrect')
  })

  it('should decline incorrect login', async () => {
    const hashedPassword = await bcrypt.hash('correct', 10)

    await db.collection('users').insertOne({
      "username": "erry",
      "password": hashedPassword
    })

    const result = await agent.post("/login").send({ "username": "erry", "password": "wrong" })
    expect(result.body).to.be.an('object')
    expect(result.body).to.have.property('error').equal('username or password incorrect')
  })

  it('should accept correct login', async () => {
    const hashedPassword = await bcrypt.hash('correct', 10)

    const user = await db.collection('users').insertOne({
      "username": "erry",
      "password": hashedPassword
    })

    const result = await agent.post("/login").send({ "username": "erry", "password": "correct" })
    expect(result.body).to.be.an('object')
    expect(result.body).to.have.property('success').equal(true)
    expect(result.body).to.have.property('userid').equal(user.insertedId + '')
  })
})
