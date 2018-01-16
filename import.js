require('dotenv').config()
const fs = require('fs')
const db = require('./src/db')
const csv = require('csv')
const moment = require('moment')

const typMapping = {
  'Registrovaným příznivcem': 'supporter',
  'Odběratelem novinek': 'subscriber',
  'Uchazečem o členství': 'wannabemember'
}
function importFile (file) {
  console.log(`processing ${file} ...`)
  fs.createReadStream(file, {encoding: 'utf-8'})
  .pipe(csv.parse())
  .pipe(csv.transform(rec => {
    const r = {
      created: moment(rec[0], 'MM-DD-YYYY'),
      rank: typMapping[rec[1]],
      name: rec[2],
      email: rec[3],
      psc: rec[4],
      username: rec[3],
      password: '',
      migrationstat: 'migrated'
    }
    db.models.user.query().insert(r)
    .then(saved => console.log(`${saved.name} saved`))
    .catch(err => {
      if (err.constraint === 'users_username_unique') {
        console.log(`${r.name} already exists`)
      } else {
        console.log(err)
      }
    })
  }))
}

db.migrate.latest()
.then(() => {
  if (process.argv.length < 3) {
    console.error('wrong args')
    process.exit()
  }
  importFile(process.argv[2])
})
.catch((err) => {
  console.log(err)
})
