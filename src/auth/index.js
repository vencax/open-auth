const SPAAuth = require('spa-auth')
const Adapter = require('./adapter')

module.exports = (app, sendMail, g) => {
  //
  const adapter = g.manip = Adapter(g.models.user, g.models.membership)

  const auth = SPAAuth(adapter, sendMail, g.createError)

  app.post('/login', g.bodyParser, auth.login)

  app.post('/register', g.bodyParser, auth.registration.register)
  app.get('/verify', auth.registration.verify)
  app.put('/setpasswd', g.bodyParser, auth.registration.setpasswd)
  app.put('/forgotten', g.bodyParser, auth.registration.requestforgotten)
  app.put('/resendverification', g.bodyParser, auth.registration.resendverification)
}
