import React, {useState} from 'react'
import _ from 'lodash'
//import { connect } from "react-redux"
//import store from './SingletonStore'

export const PREVIEWS = 'previews'
export const TABLES = 'tables'
export const NESTED = 'foo.bar.blah' // nested exemple
export const MOUSE_ACTION = 'mouseAction'
export const MOUSE_ACTION_DRAG = 'drag'
export const MOUSE_ACTION_RESIZE = 'resize'
export const MOUSE_ACTION_ADD = 'add'
export const MOUSE_ACTION_COLOR = 'color'
export const SELECTION = 'selection'
export const ROUTE = 'routepath'
export const SIDE_MENU = 'sideMenu'
export const COLOR_SIDE_MENU = 'Color Menu'
export const BACKGROUND_COLOR = 'backgroundColor'
export const SELECTED_COLOR = 'selectedColor'

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
  constructor(data, db) {
    this.data = data || {} // Immutable maybe???
    this.cacheData = {}
    this.callbacksByPath = {}
    this.componentLoadedMap = {}
    this.db = db
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
    if (!this.db) {
      _.castArray(paths).forEach(path => {
        this.callCallbacks(path, this.get(path))
      })
      return null
    }
    console.log('loading: ' + paths)
    _.castArray(paths).forEach(path => {
      const isLoaded = _.get(this.componentLoadedMap, path)
      if (!isLoaded) {
        this.db.get(path, (data) => {
          this.set(path, data)
        })
      }
    })
  }
   
  dispatch = (path, val) => {
    if (this.db) {this.db.set(path,val)}
    this.set(path,val)
  }

  unset = (rawPath) => {
    let path = _path(rawPath)
    console.log('unsetting ' + path)
    this.data = _.omit(this.data, [rawPath])
    const divPaths = path.split('.')
    for (let i = divPaths.length; i > 0; i--) {
      this.callCallbacks(divPaths.slice(0,i), undefined)
    }
  }

  dispatchDelete = (path) => {
    if (this.db) {this.db.unset(path)}
    this.unset(path)
  }

  dispatchUpdate = (path, updates) => {
    if (this.db) {this.db.update(path, updates)}
    _.keys(updates).forEach(k => {
      this.set(_path(path) + '.' + k, updates[k])
    })    
  }

  callCallbacks = (rawPath, val) => {
    const path = _path(rawPath)
    const cs = (this.callbacksByPath[path] || []).filter(c => c ? true : false)
    console.log('' + cs.length + ' callbacks called')
    _.forEach(cs, c => {
      c(val)
    })
  }

  set = (rawPath, val) => {
    let path = _path(rawPath)
    _.set(this.componentLoadedMap, path, true)
    console.log('setting ' + path)
    // TODO: Before updating, checks that the value has really changed
    _.set(this.data, path, val)
    const divPaths = path.split('.')
    for (let i = divPaths.length; i > 0; i--) {
      this.callCallbacks(divPaths.slice(0,i), val)
    }
  }

  // whenever the value of any of the paths changes, rerender the component
  subscribe = (rawPaths, callback) => {
    const paths = _.castArray(rawPaths)
    paths.forEach(p => {
      const newPaths = [..._.castArray(this.callbacksByPath[p]), callback]
      this.callbacksByPath[p] = newPaths
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

  /*function withSubscription(WrappedComponent) {
  class WithSubscription extends React.Component {/* ... *//*}
  WithSubscription.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;
  return WithSubscription;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}*/

// FUNCTION avec
// avec (rawModels : String or [String], Comp : React Component) => (props)
// avec is the french word for with which is a reserved keyword in javascript
// avec(MODEL.PREVIEW,
// avec should load and rerender the components whenever they change.
const avec = function(rawPaths, Comp){
  class Avec extends React.Component {
    constructor(props) {
      super(props)
      this.state = {subProps: null}
    }
    render() {
      const paths = _.castArray(rawPaths)
      const logSetSubProps = (blah) => {
        // important to make sure the subProps is never null
        // because null is used to mean that is was never loaded
        return this.setState({subProps: (blah || {})}) 
      }
      //const storeProps = paths.reduce((acc,curr) => {
      //  _.set(acc, curr, 
      //},{})
      return <StoreContext.Consumer>
        {store => {
          if (this.state.subProps !== null) {
            // TODO: Only pass the data needed, don't pass the whole store.data
            return <Comp {...this.props} {...store.data} {...storeProps(store)} />
          } else {
            store.subscribe(paths, logSetSubProps)
            store.load(paths)
            return null
          }
        }}
      </StoreContext.Consumer>
    }
  }
  Avec.displayName = `Avec(${getDisplayName(Comp)}, ${_.castArray(rawPaths).join(', ')})`
  return Avec;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function storeProps(store) {
  return {
    dispatch: store.dispatch,
    dispatchDelete: store.dispatchDelete,
    dispatchUpdate: store.dispatchUpdate,
    cache: store.set,
  }
}

const withDispatch = (Comp) => function WithDispatch(props) {
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
