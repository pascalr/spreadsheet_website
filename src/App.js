import React from 'react'
import { connect } from "react-redux"
import _ from 'lodash'

import 'react-contexify/dist/ReactContexify.min.css'
import './styles/react-grid-layout-style.css'
import 'react-resizable/css/styles.css'

import * as TABLES from './constants/tables'
import { defsLoaded } from './actions'
import Table from './Table'
import Screen from './Screen'
import router from './router'
import StatusBar from './StatusBar'
import SearchBar from './SearchBar'
import PreviewMenu from './menus/PreviewMenu'
import * as PATH from './constants/paths'
import TableMenu from './Table/TableMenu'
import ColumnMenu from './Table/ColumnMenu'

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
]

class App extends React.Component {
  constructor(props) {
    super(props)

    this.props.db.load(TABLES.DEFS, this.props.defsLoaded)
    this.state = {path: "/"}
  }
  
  render() {
    return (
      <div className="app">
        <div className="taskbars">
          <StatusBar/>
          <SearchBar/>
        </div>
        {router.resolve(routes, this.props.route)}
        <PreviewMenu />
        <TableMenu db={this.props.db} />
        <ColumnMenu db={this.props.db} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDistpatchToProps)(App);
