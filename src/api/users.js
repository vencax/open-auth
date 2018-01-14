const _ = require('underscore')
const Kalamata = require('kalamata')

function _listAttrs (req, qb) {
  let attrs = [
    'id', 'username', 'name', 'email', 'status', 'created',
    'rank', 'phone', 'canhelp', 'psc', 'area'
  ]
  if (req.query.attrs) {
    const wanted = req.query.attrs.split(',')
    attrs = _.filter(attrs, i => wanted.indexOf(i) >= 0)
  }
  return qb.select(attrs)
}

module.exports = (app, isAdmin, g) => {
  //
  const prefix = 'user'
  const mWarez = Kalamata(g.models.user, g)

  app.get(`/${prefix}`, g.authMW,
    mWarez.paging_q, mWarez.sorting_q, mWarez.attrs_q, mWarez.list)

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
  app.get(`/${prefix}/:id`, g.authMW, mWarez.fetch, mWarez.detail)

  // --------------------------------------------------------------------------

  app.put(`/${prefix}`, g.authMW, isAdmin, g.bodyParser,
    mWarez.fetch, mWarez.update)

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
