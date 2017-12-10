
module.exports = (User, Memberhip) => {
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
        : User.query().patch(user).where('id', user.id)
    },

    retrieveAditionalUserinfo: (user) => {
      // retrieve user's groups
      return Memberhip.query()
        .select('group_id')
        .where('user_id', '=', user.id)
        .then(memberships => {
          return Object.assign(user, {groups: memberships})
        })
    }
  }
}
