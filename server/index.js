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

getDB().then(db => {
  console.log('a wtf')
  app.use(routes(db.db))

  app.listen(port, host, () => console.log(`app listening on port ${port}!`))

  process.on('exit', function() {
    db.client.close()
  });
});
