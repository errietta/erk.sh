const bcrypt = require('bcrypt')
const express = require('express')
const validUrl = require('valid-url')

module.exports = db => {
  const router = express.Router()

  router.post('/login', async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    if (!username || !password) {
      return res.status(422).json({
        'error': 'username and password must be given'
      })
    }

    const user = await db.collection("users").findOne({username})

    if (!user) {
      return res.status(422).json({
        'error': 'username or password incorrect'
      })
    }

    if (!await bcrypt.compare(password, user.password)) {
      return res.status(422).json({
        'error': 'username or password incorrect'
      })
    }

    req.session.user = user._id

    return res.json({
      success: true,
      userid: user._id,
    })
  })

  router.post('/add', async (req, res) => {
    if (!req.session.user) {
      return res.status(422).json({
        'error': 'not logged in'
      })
    }

    const url = req.body.url
    let slug = req.body.slug

    if (!url) {
      return res.status(422).json({
        'error': 'url must be given'
      })
    }

    if (!slug) {
      let settings = await db.collection("settings").findOne({})

      if (!settings || !settings.currentId || isNaN(settings.currentId)) {
        settings = {
          "currentId": 0
        }
        await db.collection("settings").insertOne(settings)
      }

      let currentId = settings.currentId + 1
      let repeats = 0

      while (await db.collection("urls").findOne({ slug: currentId.toString(36) })) {
        currentId++
        if (++repeats > 10) {
          console.error("couldnt get next id :/")
          return res.status(500).json({ 'error': 'error' })
        }
      }

      slug = currentId.toString(36)
      db.collection("settings").update({}, { currentId })
    } else {
      const url = await db.collection("urls").findOne({ slug, })
      if (url) {
        return res.status(422).json({ 'error': 'slug already exists' })
      }
    }

    if (!validUrl.isUri(url)){
      return res.status(422).json({ 'error': 'not a valid url' })
    }

    await db.collection("urls").insert({
      url,
      slug
    })

    return res.json({
      success: true,
      slug
    })
  })

  router.get('/list', async (req, res) => {
    if (!req.session.user) {
      return res.status(422).json({
        'error': 'not logged in'
      })
    }

    const urls = await db.collection("urls").find({}).toArray()

    return res.json({
      success: true,
      items: urls.map(url => ({ url: url.url, slug: url.slug }))
    })
  })

  return router
}
