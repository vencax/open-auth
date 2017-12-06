
const Model = require('objection').Model

module.exports = (knex) => {
  Model.knex(knex)  // Give the connection to objection

  class UserModel extends Model {
    static get tableName () {
      return 'users'
    }
  }

  class GroupModel extends Model {
    static get tableName () {
      return 'groups'
    }
  }

  class MembershipModel extends Model {
    static get tableName () {
      return 'memberships'
    }
  }

  return {
    user: UserModel,
    group: GroupModel,
    membership: MembershipModel
  }
}
