/* global describe it before after */
const fs = require('fs')
const express = require('express')
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const should = chai.should()

process.env.SERVER_SECRET = 'fhdsakjhfkjal'
process.env.SERVER_SECRET_4_EMAILS = 'fdsfsfefs'
const rand = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 15)
process.env.DATABASE_URL = rand + 'test.sqlite'
process.env.NODE_ENV = 'test'
process.env.ADMIN = '1'
const port = process.env.PORT || 3333
const g = {
  loggedUser: {
    username: 'gandalf',
    email: 'gandalf@shire.nz',
    name: 'gandal the gray',
    password: 'secret'
  },
  baseurl: 'http://localhost:' + port,
  sentemails: []
}
function sendMail (mail) {
  return new Promise((resolve, reject) => {
    g.sentemails.push(mail)
    resolve(mail)
  })
}

describe('app', () => {
  const App = require('../src/app')

  before((done) => {
    g.db = require('../src/db')
    g.db.migrate.rollback()
    .then(() => {
      return g.db.migrate.latest()
    })
    .then(() => {
      g.app = express()
      App(g.app, sendMail)
      g.server = g.app.listen(port, (err) => {
        return err ? done(err) : done()
      })
    })
    .catch(done)
  })

  after((done) => {
    g.server.close()
    fs.unlinkSync(process.env.DATABASE_URL)
    done()
  })

  it('should exist', (done) => {
    should.exist(g.app)
    done()
  })

  const submodules = [
    './register',
    './api'
  ]
  submodules.map((i) => {
    const subMod = require(i)
    subMod(g)
  })
})
