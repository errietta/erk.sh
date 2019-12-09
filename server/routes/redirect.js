const express = require('express')
const bcrypt = require('bcrypt')

module.exports = db => {
  const router = express.Router()

  router.get('*', async (req, res) => {
    const path = req.baseUrl.replace(/^\//, '')
    const url = await db.collection("urls").findOne({ "slug": path })

    if (!url) {
      return res.status(404).end("not found")
    }

    return res.redirect(url.url)
  })

  return router
}
