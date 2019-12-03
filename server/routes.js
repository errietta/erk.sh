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

    const user = await db.collection("user").findOne({username})
    console.log(user)
    if (!user) {
      return res.status(422).json({
        'error': 'username or password incorrect'
      });
    }

    if (!bcrypt.compare(password, user.password)) {
      return res.status(422).json({
        'error': 'username or password inc2orrect'
      });
    }

    req.session.user = user

    return res.json({
      success: true,
      userid: user._id,
    })
  });

  return router;
}
