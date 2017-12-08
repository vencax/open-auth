
module.exports = (User) => {
  return {

    find: (body) => {
      let q = User.query()
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
        ? User.query().insert(user)
        : User.query().patch(user)
    }
  }
}
