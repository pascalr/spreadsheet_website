import _ from 'lodash'
import axios from 'axios'
//import adapter from 'axios/lib/adapters/http';

const dbname = process.env.NODE_ENV === 'production' ? 'prod_db' : 'dev_db'
const port = 8000

function _path(path) {
  return _.castArray(path).join('.')
}

class SimpleDb {
  stash = (rawPath,file) => { return null }

  get = (path, callback) => {
    axios.get('http://localhost:'+port+'/'+dbname+'/'+_path(path))
    .then(response => {
      if (callback) {
        callback(response.data)
      }
    })
  }
  set = (path, val, callback) => {
    axios.put('http://localhost:'+port+'/'+dbname+'/'+_path(path),{data: val},{ headers: { ['Content-Type']: 'application/json' }})
    .then(response => {
      if (callback) {
        callback()
      }
    })
  }
  unset = (path, callback) => {
    axios.get('http://localhost:'+port+'/'+dbname+'/get/'+_path(path))
    .then(response => {
      if (callback) {
        callback()
      }
    })
  }

  update = (path, updates) => {
    const that = this
    return _.keys(updates).map(k => {
      that.set([..._.castArray(path), k], updates[k], null)
    })    
  }
}

export default SimpleDb;
