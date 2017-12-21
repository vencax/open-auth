const _ = require('underscore')

function _listAttrs (req, qb) {
  let attrs = ['id', 'username', 'name', 'email', 'status', 'created']
  if (req.query.attrs) {
    const wanted = req.query.attrs.split(',')
    attrs = _.filter(attrs, i => wanted.indexOf(i) >= 0)
  }
  return qb.select(attrs)
}

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
  function _listMembers (req, res, next) {
    const ids = g.models.membership.query().select(['user_id'])
      .where('group_id', '=', req.params.id)
    let q = g.models.user.query().where('id', 'in', ids)
    q = _listAttrs(req, q)
    q.then(found => {
      res.json(found)
      next()
    })
    .catch(next)
  }
  app.get(`/${prefix}/:id/members`, g.authMW, _listMembers)

  // --------------------------------------------------------------------------
  function _createItem (req, res, next) {
    g.models.group.query().insert(req.body)
    .then(saved => {
      res.status(201).json(saved)
      next()
    })
    .catch(next)
  }
  app.post(`/${prefix}`, g.authMW, isAdmin, g.bodyParser, _createItem)

  // --------------------------------------------------------------------------
  function _updateItem (req, res, next) {
    g.models.group.query().patch(req.body)
    .then(saved => {
      res.json(saved)
      next()
    })
    .catch(next)
  }
  app.put(`/${prefix}`, g.authMW, isAdmin, g.bodyParser, _updateItem)

  return app
}
