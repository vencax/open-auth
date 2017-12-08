/* global describe it */
const chai = require('chai')
// const _ = require('underscore')

module.exports = function (g) {
  //
  const r = chai.request(g.baseurl)
  let group1 = {name: 'group1'}

  describe('api', () => {
    //
    it('YES! it should get public info without any auth', () => {
      return r.get('/api/user/info/1')
      .then((res) => {
        res.body.length.should.eql(1)
        Object.keys(res.body[0]).should.eql(['id', 'username', 'name'])
        res.should.have.status(200)
      })
    })

    it('should NOT get info about user without auth', (done) => {
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

    it('should NOT create a group without auth', (done) => {
      r.post('/api/group').send(group1)
      .then((res) => {
        done('shall fail with 401')
      })
      .catch((err) => {
        err.response.should.have.status(401)
        done()
      })
    })

    it('should create a group with auth', () => {
      return r.post('/api/group').send(group1).set('Authorization', g.authHeader)
      .then((res) => {
        res.should.have.status(201)
        group1 = res.body
      })
    })

    it('should NOT get info about groups without auth', (done) => {
      r.get('/api/group')
      .then((res) => {
        done('shall fail with 401')
      })
      .catch((err) => {
        err.response.should.have.status(401)
        done()
      })
    })
  })
}
