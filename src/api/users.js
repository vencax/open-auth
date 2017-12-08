const _ = require('underscore')

module.exports = (app, isAdmin, g) => {
  //
  const prefix = 'user'

  function _getUsers (req, res, next) {
    g.models.user.query()
    .select(['id', 'username', 'name', 'status', 'created'])
    .then(saved => {
      res.json(saved)
      next()
    })
    .catch(next)
  }
  app.get(`/${prefix}`, g.authMW, _getUsers)

  // --------------------------------------------------------------------------
  function _getUser (req, res, next) {
    g.models.user.query().where('id', '=', req.params.id)
    .then(found => {
      if (found.length === 0) {
        return next('user not found', 404)
      }
      res.json(_.omit(found[0], 'password'))
      next()
    })
    .catch(next)
  }
  app.get(`/${prefix}/:id`, g.authMW, _getUser)

  // --------------------------------------------------------------------------
  function _updateUser (req, res, next) {
    g.models.user.query().patch(req.body)
    .then(saved => {
      res.json(saved)
      next()
    })
    .catch(next)
  }
  app.put(`/${prefix}`, g.authMW, isAdmin, _updateUser)

  // --------------------------------------------------------------------------
  function _getPublicUserInfo (req, res, next) {
    g.models.user.query()
    .select('id', 'username', 'name')
    .where('id', 'in', req.params.ids.split(','))
    .orderBy('name', 'desc')
    .then(found => {
      res.json(found)
      next()
    })
    .catch(next)
  }
  app.get(`/${prefix}/info/:ids`, _getPublicUserInfo)

  return app
}
