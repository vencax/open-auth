const admins = (process.env.ADMIN || '').split(',').map(i => Number(i))
const Users = require('./users')
const Groups = require('./groups')

module.exports = (app, g) => {
  //
  function _isAdmin (req, res, next) {
    if (admins.indexOf(req.user.id) < 0) {
      return next(g.createError('insufficient permissions', 401))
    }
    next()
  }

  Users(app, _isAdmin, g)
  Groups(app, _isAdmin, g)

  return app
}
