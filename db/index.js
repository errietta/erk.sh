const MongoClient = require('mongodb').MongoClient

const getDB = async () => {
  const url = process.env.MONGO_URL
  const db = process.env.MONGO_DB
  const client = new MongoClient(url);

  // Use connect method to connect to the Server
  await client.connect()
  return {
    client,
    db: client.db(db)
  }
}

module.exports = {
  getDB
}
