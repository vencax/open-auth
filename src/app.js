const express = require('express')
const bodyParser = require('body-parser')
const expressJwt = require('express-jwt')
const db = require('./db')
const UserApi = require('./api')
const Auth = require('./auth')

function _createError (message, status) {
  return {status: status || 400, message}
}

const g = {
  authMW: expressJwt({secret: process.env.SERVER_SECRET}),
  createError: _createError,
  models: db.models,
  startTransaction: db.startTransaction,
  bodyParser: bodyParser.json()
}

module.exports = (app, sendMail) => {
  // init auth routes
  Auth(app, sendMail, g)

  const api = express()
  app.use('/api', UserApi(api, g))

  function _generalErrorHandler (err, req, res, next) {
    res.status(err.status || 400).send(err.message || err)
    if (process.env.NODE_ENV !== 'production') {
      console.log('---------------------------------------------------------')
      console.log(err)
      console.log('---------------------------------------------------------')
    }
  }
  function _authErrorHandler (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      return res.status(err.status).send(err.message)
    }
    next(err)
  }
  app.use(_authErrorHandler, _generalErrorHandler)
}
