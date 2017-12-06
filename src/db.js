const Knex = require('knex')
const path = require('path')
const Models = require('./models')
const DB_URL = process.env.DATABASE_URL

const commonOpts = {
  migrations: {
    directory: path.join(__dirname, 'migrations')
  }
}
const debugOpts = {
  client: 'sqlite3',
  connection: {
    filename: DB_URL === undefined ? ':memory:' : DB_URL
  },
  useNullAsDefault: true,
  debug: true,
  pool: { min: 0, max: 7 }
}
const productionOpts = {
  client: DB_URL.indexOf('postgres') >= 0 ? 'pg' : 'mysql',
  connection: DB_URL
}
let opts = process.env.NODE_ENV === 'production' ? productionOpts : debugOpts
opts = Object.assign(commonOpts, opts)

const knex = Knex(opts)

function _startTransaction (cb) {
  return bookshelf.transaction(cb)
}

module.exports = {
  models: Models(knex),
  startTransaction: _startTransaction,
  migrate: knex.migrate
}
