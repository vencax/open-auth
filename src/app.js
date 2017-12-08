const express = require('express')
const bodyParser = require('body-parser')
const db = require('./db')
const UserApi = require('./userapi')
const Auth = require('./auth')

function _createError (message, status) {
  return {status: status || 400, message}
}

const g = {
  // authMW: expressJwt({secret: process.env.SERVER_SECRET}),
  createError: _createError,
  models: db.models,
  startTransaction: db.startTransaction,
  bodyParser: bodyParser.json()
}

module.exports = (app, sendMail) => {
  // init auth routes
  Auth(app, sendMail, g)

  const api = express()
  app.use('/users', UserApi(api, g))

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
