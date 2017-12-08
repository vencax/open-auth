require('dotenv').config()
const cors = require('cors')
const express = require('express')
const port = process.env.PORT || 3000
const App = require('./src/app')
const db = require('./src/db')

function sendMail (mail) {
  return new Promise((resolve, reject) => {
    console.log(mail)
    resolve(mail)
  })
}

const app = express()

// init CORS?
const opts = {
  maxAge: 86400,
  origin: process.env.ALLOWED_ORIGIN || '*',
  methods: ['DELETE', 'PUT', 'POST', 'OPTIONS', 'GET'],
  exposedHeaders: ['x-total-count']
}
app.use(cors(opts))

db.migrate.latest()
.then(() => {
  App(app, sendMail)
  app.listen(port, function () {
    console.log('gandalf do magic on ' + port)
  })
})
.catch((err) => {
  console.log(err)
})
