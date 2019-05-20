import React from 'react'
import _ from 'lodash'
import { connect } from "react-redux"
import store from './SingletonStore'

export const PREVIEWS = 'previews'
export const TABLES = 'tables'
export const NESTED = 'foo.bar.blah' // nested exemple

/*class PreviewsController {
  foo = () => {
    return 10
  }
}*/

//const controllerMap = {
//  PREVIEWS: PreviewsController,
//}

class Store {
  constructor() {
    this.data = {} // Immutable maybe???
    this.componentsByPath = {}
  }
  get = (path) => {return _.get(this.data, path)}
  set = (path, val) => {
    // TODO: Before updating, checks that the value has really changed
    _.set(this.data, path, val)
    const c = this.componentsByPath[path]
    if (c) { c.forceUpdate() }
  }

  subscribe = (rawPaths, component) => {
    const paths = _.castArray(rawPaths)
    paths.forEach(p => {
      this.componentsByPath[p] = [..._.castArray(this.componentsByPath[p]), component]
    })
  }
}

// default values go here
const StoreContext = React.createContext({
  testDefault: 1 // default value
})

class StoreProvider extends React.Component {
  constructor(props) {
    super(props)
    //this.controller = new PreviewsController()
    this.store = new Store()
  }

  render() {
    // This provider will never update because it's always the same reference.
    return <StoreContext.Provider value={this.store}>
      {this.props.children}
    </StoreContext.Provider>
  }
}

// this.props.store

const withPreviews = (Comp) => (props) => {
  return <StoreContext.Consumer>
    {test => <Comp {...props} test={test} />}
  </StoreContext.Consumer>
}

// FUNCTION avec
// avec (rawModels : String or [String], Comp : React Component) => (props)
// avec is the french word for with which is a reserved keyword in javascript
// avec(MODEL.PREVIEW,
const avec = (rawPaths, Comp) => (props) => {
  const paths = _.castArray(rawPaths)
  // A subcontext is created to delegate the responsability of calling the
  // component rerender when the data required changes.

  const SubContext = React.createContext({})
  return <StoreContext.Consumer>
    {store => {
      const component = (
        //<SubContext.Provider value={store.get()}>
        //  <SubContext.Consumer>
            {test => <Comp {...props} test={test} />}
        //  </SubContext.Consumer>
        //</SubContext.Provider>
      )
      // whenever the value of any of the paths changes, rerender the component
      store.subscribe(paths, component)
      return component
    }}
  </StoreContext.Consumer>
}

//export avec(PREVIEWS)(Exemple)
//export avec([TABLES, PREVIEWS])(Exemple)

export {withPreviews}
export {StoreProvider}
