const bcrypt = require('bcrypt')

const { getDB } = require('../db')

const doInsert = async db => {
  const opt = require('node-getopt').create([
    ['u' , 'username=ARG'   , 'username'],
    ['p' , 'password=ARG'   , 'password'],
  ])
  .bindHelp()
  .parseSystem()

  const opts = opt.options

  if (!opts.username || !opts.password) {
    console.log('pls enter user or pass')
    return
  }

  const hashedPassword = await bcrypt.hash(opts.password, 10)
  const user = {
    username: opts.username,
    password: hashedPassword
  }

  const record = await db.collection('users').insertOne(user)
  console.log("record created", record)
}

(async () => {
  const db = await getDB()
  await doInsert(db.db)
  db.client.close()
})()
