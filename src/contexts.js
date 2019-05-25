import React, {useState} from 'react'
import _ from 'lodash'
import SimpleDb from './SimpleDb'
//import { connect } from "react-redux"
//import store from './SingletonStore'

export const PREVIEWS = 'previews'
export const TABLES = 'tables'
export const NESTED = 'foo.bar.blah' // nested exemple

function _path(path) {
  if (typeof path === 'string') {
    return path
  } else {
    return _.castArray(path).join('.')
  }
}

// Lazy loading data
// The issue with lazy loading is that it makes render functions non pure.
class Store {
  constructor(data) {
    this.data = data || {} // Immutable maybe???
    this.callbacksByPath = {}
    this.componentLoadedMap = {}
    this.db = new SimpleDb()
  }
  // Format could be array, string
  get = (path) => {
    return _.get(this.data, path)
    /*const isLoaded = _.get(this.componentLoadedMap, path)
    if (isLoaded) {
      return _.get(this.data, path)
    } else {
      this.db.get(path, (data) => {
        this.set(path, data)
        _.set(this.componentLoadedMap, path)
      })
    }*/
  }

  load = (paths) => {
    console.log('loading: ' + paths)
    _.castArray(paths).forEach(path => {
      const isLoaded = _.get(this.componentLoadedMap, path)
      if (!isLoaded) {
        this.db.get(path, (data) => {
          _.set(this.componentLoadedMap, path, true)
          this.set(path, data)
        })
      }
    })
  }
   
  dispatch = (path, val) => {
    this.db.set(path,val)
    this.set(path,val)
  }

  unset = (rawPath, val) => {
    let path = _path(rawPath)
    console.log('unsetting ' + path)
    this.data = _.omit(this.data, [rawPath])
    const divPaths = path.split('.')
    for (let i = divPaths.length; i > 0; i--) {
      path = _path(divPaths.slice(0,i))
      if (this.callbacksByPath[path]) {
        const cs = this.callbacksByPath[path].filter(c => c ? true : false)
        console.log('' + cs.length + ' callbacks called')
        _.forEach(cs, c => {
          c(val)
        })
      }
    }
  }

  dispatchDelete = (path) => {
    this.db.unset(path)
    this.unset(path)
  }

  dispatchUpdate = (path, updates) => {
    this.db.update(path, updates)
    _.keys(updates).forEach(k => {
      this.set(_path(path) + '.' + k, updates[k])
    })    
  }

  set = (rawPath, val) => {
    let path = _path(rawPath)
    console.log('setting ' + path)
    // TODO: Before updating, checks that the value has really changed
    _.set(this.data, path, val)
    const divPaths = path.split('.')
    for (let i = divPaths.length; i > 0; i--) {
      path = _path(divPaths.slice(0,i))
      if (this.callbacksByPath[path]) {
        const cs = this.callbacksByPath[path].filter(c => c ? true : false)
        console.log('' + cs.length + ' callbacks called')
        _.forEach(cs, c => {
          c(val)
        })
      }
    }
  }

  // whenever the value of any of the paths changes, rerender the component
  subscribe = (rawPaths, callback) => {
    const paths = _.castArray(rawPaths)
    paths.forEach(p => {
      const newPaths = [..._.castArray(this.callbacksByPath[p]), callback]
      this.callbacksByPath[p] = newPaths
      this.componentLoadedMap[p] = false
    })
  }

}

const StoreContext = React.createContext({})

class StoreProvider extends React.Component {
  render() {
    // This provider will never update because it's always the same reference.
    return <StoreContext.Provider value={this.props.store}>
      {this.props.children}
    </StoreContext.Provider>
  }
}

// FUNCTION avec
// avec (rawModels : String or [String], Comp : React Component) => (props)
// avec is the french word for with which is a reserved keyword in javascript
// avec(MODEL.PREVIEW,
// avec should load and rerender the components whenever they change.
const avec = (rawPaths, Comp) => (props) => {
  const [subProps, setSubProps] = useState(null)
  const paths = _.castArray(rawPaths)
  const logSetSubProps = (blah) => {
    // important to make sure the subProps is never null
    // because null is used to mean that is was never loaded
    return setSubProps(blah || {}) 
  }
  //const storeProps = paths.reduce((acc,curr) => {
  //  _.set(acc, curr, 
  //},{})
  return <StoreContext.Consumer>
    {store => {
      if (subProps !== null) {
        // TODO: Only pass the data needed, don't pass the whole store.data
        return <Comp {...props} {...store.data} {...storeProps(store)} />
      } else {
        store.subscribe(paths, logSetSubProps)
        store.load(paths)
        return null
      }
    }}
  </StoreContext.Consumer>
}

function storeProps(store) {
  return {
    dispatch: store.dispatch,
    dispatchDelete: store.dispatchDelete,
    dispatchUpdate: store.dispatchUpdate,
  }
}

const withDispatch = (Comp) => (props) => {
  return <StoreContext.Consumer>
    {store => {
      return <Comp {...props} {...storeProps(store)}/>
    }}
  </StoreContext.Consumer>
}

//export avec(PREVIEWS)(Exemple)
//export avec([TABLES, PREVIEWS])(Exemple)

export {withDispatch}
export {StoreProvider}
export {Store}
export {avec}
