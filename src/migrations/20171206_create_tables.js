exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('users', (table) => {
      table.increments('id').primary()
      table.string('username', 16).notNullable()
      table.string('name', 64).notNullable()
      table.string('email', 64).notNullable()
      table.string('password', 512).notNullable()
      table.enu('status', ['enabled', 'disabled']).defaultTo('disabled')
      table.timestamp('created').notNullable().defaultTo(knex.fn.now())
      table.unique(['username'])
    }),
    knex.schema.createTable('groups', (table) => {
      table.increments('id').primary()
      table.string('name', 64).notNullable()
      table.timestamp('created').notNullable().defaultTo(knex.fn.now())
      table.unique(['name'])
    }),
    knex.schema.createTable('memberships', (table) => {
      table.integer('user_id').notNullable().primary()
      table.integer('group_id').notNullable().primary()
      table.timestamp('created').notNullable().defaultTo(knex.fn.now())
    })
  ])
}

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('users'),
    knex.schema.dropTable('groups'),
    knex.schema.dropTable('memberships')
  ])
}
