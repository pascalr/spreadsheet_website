import React from 'react'
import { connect } from "react-redux"
import _ from 'lodash'
import Console from './Console'

import 'react-contexify/dist/ReactContexify.min.css'
import './styles/react-grid-layout-style.css'
import 'react-resizable/css/styles.css'

import * as TABLES from './constants/tables'
import { defsLoaded } from './actions'
import Table from './Table'
import Screen from './Screen'
import Edit from './Edit'
import router from './router'
import StatusBar from './StatusBar'
import SearchBar from './SearchBar'
import PreviewMenu from './menus/PreviewMenu'
import * as PATH from './constants/paths'

const uuidv1 = require('uuid/v1');

const mapStateToProps = state => ({
  db: state.db,
  route: _.get(state.cache.root, PATH.ROUTE),
})

const mapDistpatchToProps = dispatch => ({
  defsLoaded: defs => dispatch(defsLoaded(defs))
})

const routes = [
  {path: '/index.html', action: () => (<Screen />), default: true},
  {path: '/', action: () => (<Screen />)},
  {path: '/tables/:id', action: (props) => (<Table {...props} />)},
  {path: '/edit/:id', action: (props) => (<Edit {...props} />)},
]

// Loads all the tables and generates defs
// Wont work when I will have a lot of data...
function generateDefs(db) {
  db.load(TABLES.TABLES2, (tables) => {
    const defs = Object.keys(tables).reduce((acc,k) => {
      if (tables[k][0]) {
        acc[k] = {name: "fixme", columns: Object.keys(tables[k][0]).map(c => (
          {name: c}
        ))}
      } else {
        acc[k] = {name: "fixme", columns: []}
      }
      return acc;
    }, {})
    db.set(TABLES.DEFS, defs);
  })
}

  /*function addUUIDS2(db) {
  db.load(TABLES.DEFS, (defs) => {
  db.load(TABLES.TABLES, (tables) => {
    const withUUID = Object.keys(tables).map(k => {
      debugger
      const table = tables[k];
      const def = defs[k];
      if (def) {
        const values = table.map(row => (
          Object.keys(row).reduce((acc,k) => {
            const i = Object.keys(def.columns2).findIndex(id => (def.columns2[id].name === k))
            const theId = Object.keys(def.columns2)[i];
            acc[theId] = row[k];
            return acc;
          }, {})
        ))
        return values
      } else {
        return null
      }
    })
    db.set(TABLES.TABLES, withUUID);
  })
  })
}*/

function addUUIDS(db) {
  db.load(TABLES.DEFS, (defs) => {
    const withUUID = _.keys(defs).reduce((acc,k) => {
      const def = defs[k];
      const columns = def.columns.reduce((acc2,k2) => {
        //const id = uuidv1();
        acc2[k2.name] = k2;
        return acc2;
      }, {})
      def.cols = columns;
      acc[k] = def;
      return acc;
    }, {})
    db.set(TABLES.DEFS, withUUID);
  })
}

function addColLayout(db) {
  db.load(TABLES.DEFS, (defs) => {
    const withUUID = Object.keys(defs).reduce((acc,k) => {
      const def = defs[k];
      def.layout = [_.keys(def.cols)]
      acc[k] = def;
      return acc;
    }, {})
    db.set(TABLES.DEFS, withUUID);
  })
}

class App extends React.Component {
  constructor(props) {
    super(props)

    this.props.db.load(TABLES.DEFS, this.props.defsLoaded)
    this.state = {
      path: "/"
    }
  }
    //    <button onClick={() => generateDefs(this.props.db)}>gen defs</button>
  //    <button onClick={() => addUUIDS(this.props.db)}>add uuids</button>
  //      <button onClick={() => addColLayout(this.props.db)}>add col layout</button>
  render() {
    return (
      <div className="app">
        <div className="taskbars">
          <StatusBar/>
          <SearchBar/>
        </div>
        {/*<Console/>
        <hr />*/}
        {router.resolve(routes, this.props.route)}
        <PreviewMenu />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDistpatchToProps)(App);
