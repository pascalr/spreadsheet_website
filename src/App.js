import React from 'react'
import { connect } from "react-redux"
import _ from 'lodash'

import 'react-contexify/dist/ReactContexify.min.css'
import './styles/react-grid-layout-style.css'
import 'react-resizable/css/styles.css'

import ColumnMenu from './Table/ColumnMenu'
import TableMenu from './Table/TableMenu'
import * as TABLE from './constants/tables'
import { defsLoaded } from './actions'
import Table from './Table'
import Screen from './Screen'
import router from './router'
import StatusBar from './StatusBar'
import SearchBar from './SearchBar'
import PreviewMenu from './menus/PreviewMenu'
import * as PATH from './constants/paths'

const mapStateToProps = state => ({
  db: state.db,
  route: _.get(state.cache.root, PATH.ROUTE),
  history: state.history,
})

const mapDistpatchToProps = dispatch => ({
  defsLoaded: defs => dispatch(defsLoaded(defs))
})

const routes = [
  {path: '/index.html', action: () => (<Screen />), default: true},
  {path: '/', action: () => (<Screen />)},
  {path: '/tables/:id', action: (props) => (<Table {...props} />)},
]

class App extends React.Component {
  constructor(props) {
    super(props)

    this.props.db.load(TABLE.DEFS, this.props.defsLoaded)
    this.state = {path: "/"}
  }
  
  render() {
    this.props.history.push(this.props.route)
    return (
      <div className="app">
        <div className="taskbars">
          <StatusBar/>
          <SearchBar/>
        </div>
        <div onClick={() => {
          this.props.db.load(TABLE.TABLES, (tables) => {
            const tableIds = _.keys(tables)
            const tablesToAdd = tableIds.reduce((newTables, id) => {
              let valuesByColumn = {}
              const rows = tables[id]
              rows.forEach(r => {
                const columnIds = _.keys(r)
                columnIds.forEach(c => {
                  valuesByColumn[c] = [...(valuesByColumn[c] || []), r[c]]
                })
              })
              newTables[id] = valuesByColumn
              return newTables
            },{})
            this.props.db.setPath([TABLE.TABLES], tablesToAdd)
            console.log(tables)
            console.log(tablesToAdd)
          })
        }}>Change table data</div>
        {router.resolve(routes, this.props.route)}
        <PreviewMenu />
        <TableMenu db={this.props.db} />
        <ColumnMenu db={this.props.db} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDistpatchToProps)(App);
