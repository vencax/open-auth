
module.exports = (app, isAdmin, g) => {
  //
  const prefix = 'group'

  function _getItems (req, res, next) {
    g.models.group.query()
    .select(['id', 'name', 'created'])
    .then(found => {
      res.json(found)
      next()
    })
    .catch(next)
  }
  app.get(`/${prefix}`, g.authMW, _getItems)

  // --------------------------------------------------------------------------
  function _getItem (req, res, next) {
    g.models.group.query().where('id', '=', req.params.id)
    .then(found => {
      if (found.length === 0) {
        return next('group not found', 404)
      }
      res.json(found[0])
      next()
    })
    .catch(next)
  }
  app.get(`/${prefix}/:id`, g.authMW, _getItem)

  // --------------------------------------------------------------------------
  function _createItem (req, res, next) {
    g.models.user.query().create(req.body)
    .then(saved => {
      res.json(saved)
      next()
    })
    .catch(next)
  }
  app.post(`/${prefix}`, g.authMW, isAdmin, _createItem)

  // --------------------------------------------------------------------------
  function _updateItem (req, res, next) {
    g.models.user.query().patch(req.body)
    .then(saved => {
      res.json(saved)
      next()
    })
    .catch(next)
  }
  app.put(`/${prefix}`, g.authMW, isAdmin, _updateItem)

  return app
}
