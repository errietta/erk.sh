const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')

const MemcachedStore = require("connect-memcached")(session);

const routes = require('./routes')
const redirectRoutes = require('./routes/redirect')

const app = express()
const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3000
const memcache_host = process.env.MEMCACHE_HOST || '127.0.0.1'

app.use(express.static('static'))

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 86400000 },
    resave: false,
    saveUninitialized: false,
    store: new MemcachedStore({
      hosts: [memcache_host],
    })
  })
)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const startup = async (db, client) => {
  app.use((_req, res, next) => {
    res.set('x-robots-tag', 'noindex, nofollow, nosnippet')
    return next()
  })

  app.get('/', (_req, res) => res.send('Hello World!'))
  app.use(routes(db))
  app.use("*", redirectRoutes(db))

  const listener = app.listen(port, host, () => console.log(`app listening on port ${port}!`))

  process.on('exit', function() {
    client.close()
  });

  return { app, listener }
}


module.exports = startup
