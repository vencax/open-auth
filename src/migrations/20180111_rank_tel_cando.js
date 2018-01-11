const ranks = [
  'subscriber', 'supporter', 'wannabemember', 'member'
]

exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.table('users', (table) => {
      table.enu('rank', ranks).defaultTo('subscriber')
      table.string('phone', 16)
      table.string('canhelp', 64)
      table.string('psc', 16).notNullable().defaultTo('xxx')
      table.string('note', 512)
    })
  ])
}

exports.down = (knex, Promise) => {
  return knex.schema.table('users', (table) => {
    table.dropColumn('rank')
    table.dropColumn('phone')
    table.dropColumn('canhelp')
    table.dropColumn('psc')
    table.dropColumn('note')
  })
}
