const express = require('express')
const bcrypt = require('bcrypt')

module.exports = db => {
  const router = express.Router()

  router.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
      return res.status(422).json({
        'error': 'username and password must be given'
      });
    }

    const user = await db.collection("users").findOne({username})

    if (!user) {
      return res.status(422).json({
        'error': 'username or password incorrect'
      });
    }

    if (!bcrypt.compare(password, user.password)) {
      return res.status(422).json({
        'error': 'username or password incorrect'
      });
    }

    req.session.user = user

    return res.json({
      success: true,
      userid: user._id,
    })
  });

  router.post('/add', async (req, res) => {
    if (!req.session) {
      return res.status(422).json({
        'error': 'not logged in'
      });
    }
    const url = req.body.url;
    let slug = req.body.slug;

    if (!url) {
      return res.status(422).json({
        'error': 'url must be given'
      });
    }
    console.log("mooo")

    if (!slug) {
      const settings = await db.collection("settings").findOne({})

      if (!settings) {
        settings = {
          "currentId": 0
        }
        await db.collection("settings").insertOne({
          "currentId": 0
        })
      }

      let currentId = settings.curentId + 1

      repeats = 0
      while (await db.collection("urls").findOne({ slug: currentId.toString(36) })) {
        currentId++
        if (++repeats > 10) {
          cosole.error("couldnt get next id :/")
          return res.status(500)
        }
      }

      slug = currentId.toString(36)
      db.collection("settings").update({}, { currentId })
    }

    await db.collection("urls").insert({
      url,
      slug
    })

    return res.json({
      success: true,
      slug
    })
  });

  return router;
}
