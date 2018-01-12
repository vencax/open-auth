const SPAAuth = require('spa-auth')
const Adapter = require('./adapter')

module.exports = (app, sendMail, g) => {
  //
  const adapter = g.manip = Adapter(g.models.user, g.models.membership)

  const auth = SPAAuth(adapter, sendMail, g.createError)

  app.post('/login', g.bodyParser, auth.login)

  function _checkRegister (req, res, next) {
    if (req.body.rank === 'member') {
      return next(g.createError('you cannot register as member'))
    }
    next()
  }
  app.post('/register', g.bodyParser, _checkRegister, auth.registration.register)
  app.get('/verify', auth.registration.verify)
  app.put('/setpasswd', g.bodyParser, auth.registration.setpasswd)
  app.put('/forgotten', g.bodyParser, auth.registration.requestforgotten)
  app.put('/resendverification', g.bodyParser, auth.registration.resendverification)

  function _registerAtWeb (req, res, next) {
    Object.assign(req.body, {
      username: req.body.email.split('@')[0].substring(0, 15),
      password: ''
    })
    return adapter.save(req.body)
    .then(user => {
      res.json(user)
      return sendMail({
        from: process.env.WELCOME_EMAIL_USER,
        to: user.email,
        subject: process.env.WELCOME_EMAIL_SUBJECT,
        text: process.env.WELCOME_EMAIL.replace('\\n', '\n')
      })
    })
    .catch(next)
  }
  app.post('/register_web', g.bodyParser, _registerAtWeb)
}
