/* global describe it */
const chai = require('chai')
// const _ = require('underscore')

module.exports = function (g) {
  //
  const r = chai.request(g.baseurl)

  describe('api', () => {
    //
    it('should get public info withou any auth', () => {
      return r.get('/api/user/info/1')
      .then((res) => {
        res.body.length.should.eql(1)
        Object.keys(res.body[0]).should.eql(['id', 'username', 'name'])
        res.should.have.status(200)
      })
    })

    it('should NOT get info about user withou auth', (done) => {
      r.get('/api/user')
      .then((res) => {
        done('shall fail with 401')
      })
      .catch((err) => {
        err.response.should.have.status(401)
        done()
      })
    })

    it('should get info about user with auth', () => {
      return r.get('/api/user').set('Authorization', g.authHeader)
      .then((res) => {
        console.log(res.body)
        res.should.have.status(200)
      })
    })

    it('should get info about user with auth', () => {
      return r.get('/api/user/1').set('Authorization', g.authHeader)
      .then((res) => {
        console.log(res.body)
        res.should.have.status(200)
      })
    })
  })
}
