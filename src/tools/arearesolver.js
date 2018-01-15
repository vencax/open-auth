const axios = require('axios')
const URL = 'https://czgovopts.herokuapp.com/psc2region'
const data = {}

const _mapping = {
  'Hlavní město Praha': 'praha',
  'Středočeský': 'strdc',
  'Plzeňský': 'plzen',
  'Jihočeský': 'jihoc',
  'Ústecký': 'ustec',
  'Liberecký': 'liber',
  'Královéhradecký': 'kralo',
  'Karlovarský': 'karlo',
  'Pardubický': 'pardu',
  'Vysočina': 'vysoc',
  'Jihomoravský': 'jihmo',
  'Zlínský': 'zlins',
  'Moravskoslezský': 'morsl',
  'Olomoucký': 'olomo'
}

function _load () {
  axios.get(URL)
  .then(res => {
    for (let i in res.data) {
      i = i.toString()
      if (_mapping[res.data[i]] === undefined) {
        console.log('KOKOT' + res.data[i])
        data[i] = res.data[i]
      } else {
        data[i] = _mapping[res.data[i]]
      }
    }
  })
  .catch(() => {
    setTimeout(_load, 3000) // retry
  })
}
_load()

exports.getArea = function (psc) {
  return data[psc] || null
}

exports.setUnset = function (Model) {
  Model.query().where({area: null}).then(found => {
    found.map(i => {
      Model.query().update({area: data[i.psc]}).where({id: i.id})
      .then(() => console.log(`${i.username} updated`))
      .catch(() => {})
    })
  })
}
