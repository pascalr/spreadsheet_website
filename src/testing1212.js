const { Map } = require('immutable');
let m = Map({})
m = m.setIn(['foo'], '')
console.log(m.toJS())
