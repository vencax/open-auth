
module.exports = (db) => {
  return {

    find: (body) => {
      let q = db.models.user.query()
      if (body.username) {
        q = q.where('username', '=', body.username)
      }
      if (body.email) {
        q = q.orWhere('email', '=', body.email)
      }
      return q.then((found) => {
        return found.length > 0 ? found[0] : null
      })
    },

    save: (user) => {
      return (user.id === undefined)
        ? db.models.user.query().insert(user)
        : db.models.user.query().patch(user)
    }
  }
}
