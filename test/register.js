/* global describe it */
const chai = require('chai')
const expect = chai.expect
const _ = require('underscore')

module.exports = function (g) {
  //
  const r = chai.request(g.baseurl)

  describe('register', () => {
    //
    it('reg a new user', () => {
      return r.post('/register').send(g.loggedUser)
      .then((res) => {
        res.should.have.status(201)
        const token = g.sentemails[0].text.match(/sptoken=([^\n]+)/)[1]
        return r.get(`/register/verify?sptoken=${token}`)
      })
      .catch(function (err) {
        expect(err.response).to.redirect
      })
    })

    it('login the new user', () => {
      return r.post('/login').send(_.pick(g.loggedUser, ['username', 'password']))
      .then((res) => {
        res.should.have.status(200)
        g.token = res.body.token
        g.authHeader = 'Bearer ' + g.token
      })
    })
  })
}
