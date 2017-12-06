const express = require('express')
const bodyParser = require('body-parser')
const db = require('./db')
const SPAAuth = require('spa-auth')
// const Userman = require('basic-userman')

module.exports = (app, sendMail) => {
  app.use(bodyParser.json())  // JSON body parser for parsing incoming data

  // setup api
  function _createError (message, status) {
    return {status: status || 400, message}
  }

  const g = {
    // authMW: expressJwt({secret: process.env.SERVER_SECRET}),
    createError: _createError,
    models: db.models,
    startTransaction: db.startTransaction
  }

  const manip = g.manip = require('./usermanip')(db)

  const auth = SPAAuth(manip, sendMail, _createError)

  app.post('/login', bodyParser.json(), auth.login)

  const registration = express()
  registration.use(bodyParser.json())
  registration.post('/', auth.registration.register)
  registration.get('/verify', auth.registration.verify)
  registration.put('/setpasswd', auth.registration.setpasswd)
  registration.put('/forgotten', auth.registration.requestforgotten)
  app.use('/register', registration)

  // const userman = Userman(db)
  // api = express()
  // app.use('/users', userman.users)

  function _generalErrorHandler (err, req, res, next) {
    res.status(err.status || 400).send(err.message || err)
    if (process.env.NODE_ENV !== 'production') {
      console.log('---------------------------------------------------------')
      console.log(err)
      console.log('---------------------------------------------------------')
    }
  }
  app.use(_generalErrorHandler)
}
