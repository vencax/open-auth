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
  const prefix = 'user'

  function _getItems (req, res, next) {
    let q = g.models.user.query()
    q = _listAttrs(req, q)
    q.then(found => {
      res.json(found)
      next()
    })
    .catch(next)
  }
  app.get(`/${prefix}`, g.authMW, _getItems)

  // --------------------------------------------------------------------------
  function _getItem (req, res, next) {
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
  app.get(`/${prefix}/:id`, g.authMW, _getItem)

  // --------------------------------------------------------------------------
  function _updateItem (req, res, next) {
    g.models.user.query().patch(req.body)
    .then(saved => {
      res.json(saved)
      next()
    })
    .catch(next)
  }
  app.put(`/${prefix}`, g.authMW, isAdmin, g.bodyParser, _updateItem)

  // --------------------------------------------------------------------------
  function _getPublicUserInfo (req, res, next) {
    g.models.user.query()
    .select('id', 'username', 'name', 'email')
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
