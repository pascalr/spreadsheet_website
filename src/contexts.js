import React, {useState} from 'react'
import _ from 'lodash'
import SimpleDb from './SimpleDb'
//import { connect } from "react-redux"
//import store from './SingletonStore'

export const PREVIEWS = 'previews'
export const TABLES = 'tables'
export const NESTED = 'foo.bar.blah' // nested exemple

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
    return _.get(this.data, path) || {}
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
          this.set(path, data)
          _.set(this.componentLoadedMap, path)
        })
      }
    })
  }

  set = (path, val) => {
    console.log('setting ' + path)
    // TODO: Before updating, checks that the value has really changed
    _.set(this.data, path, val)
    const cs = this.callbacksByPath[path].filter(c => c ? true : false)
    console.log(cs)
    _.forEach(cs, c => {
      console.log('in here')
      console.log(c)
      c(val)
    })
  }

  // whenever the value of any of the paths changes, rerender the component
  subscribe = (rawPaths, callback) => {
    const paths = _.castArray(rawPaths)
    paths.forEach(p => {
      this.callbacksByPath[p] = [..._.castArray(this.callbacksByPath[p]), callback]
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
  console.log('here')
  const [subProps, setSubProps] = useState(null)
  const paths = _.castArray(rawPaths)
  function logSetSubProps(blah) {
    console.log('callback called')
    console.log(blah)
    return setSubProps(blah)
  }
  //const storeProps = paths.reduce((acc,curr) => {
  //  _.set(acc, curr, 
  //},{})
  return <StoreContext.Consumer>
    {store => {
      console.log('there')
      if (subProps !== null) {
        // FIXME: Dont pass the store
        // TODO: Only pass the props needed
        const o = {}
        return <div className='here'><Comp {...props} {...store.data} /></div>
        //return <div className='here'><Comp {...props} {...subProps} store={store} /></div>
      } else {
        store.subscribe(paths, logSetSubProps)
        store.load(paths)
        return null
      }
    }}
  </StoreContext.Consumer>
}

//export avec(PREVIEWS)(Exemple)
//export avec([TABLES, PREVIEWS])(Exemple)

export {StoreProvider}
export {Store}
export {avec}
