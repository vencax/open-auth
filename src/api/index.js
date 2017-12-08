const admins = (process.env.ADMIN || '').split(',').map(i => Number(i))

module.exports = (app, g) => {
  //
  function _isAdmin (req, res, next) {
    if (admins.indexOf(req.user.id) < 0) {
      return next(g.createError('insufficient permissions', 401))
    }
    next()
  }

  // --------------------------------------------------------------------------
  function _getUsers (req, res, next) {
    g.models.user.query()
    .then(saved => {
      res.json(saved)
      next()
    })
    .catch(next)
  }
  app.get('/', g.authMW, _getUsers)

  // --------------------------------------------------------------------------
  function _updateUser (req, res, next) {
    g.models.user.query().patch(req.body)
    .then(saved => {
      res.json(saved)
      next()
    })
    .catch(next)
  }
  app.put('/', g.authMW, _isAdmin, _updateUser)

  // --------------------------------------------------------------------------
  function _getPublicUserInfo (req, res, next) {
    g.models.user.query()
    .select('id', 'username', 'name')
    .where('id', 'in', req.params.ids.split(','))
    .then(found => {
      res.json(found)
      next()
    })
    .catch(next)
  }
  app.get('/info/:ids', _getPublicUserInfo)

  return app
}
