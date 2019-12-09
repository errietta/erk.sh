const { getDB } = require('../db')
const app = require('./app')

const startup = async () => {
  const { db, client } = await getDB()
  await app(db, client)
}

startup()
