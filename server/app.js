const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')

const { getDB } = require('../db')
const routes = require('./routes')

const app = express()
const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3000

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 60000 }
  })
)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (_req, res) => res.send('Hello World!'))

const startup = async (db, client) => {
  app.use(routes(db))
  listener = app.listen(port, host, (u) => console.log(`app listening on port ${port}!`))

  process.on('exit', function() {
    client.close()
  });

  return { app, listener }
}


module.exports = startup
