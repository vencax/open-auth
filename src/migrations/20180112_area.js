
exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.table('users', (table) => {
      table.string('area', 16)
    })
  ])
}

exports.down = (knex, Promise) => {
  return knex.schema.table('users', (table) => {
    table.dropColumn('area')
  })
}
