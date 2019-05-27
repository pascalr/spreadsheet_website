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
import FAB from './FAB'
import Tooltip from './Tooltip'
import {avec, ROUTE} from './contexts'
import SideMenu from './SideMenu'

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

    this.props.db.get(TABLE.DEFS, this.props.defsLoaded)
  }
  
  render() {
    const route = _.get(this.props, ROUTE) || this.props.route
    if (route) {
      this.props.history.push({
        hash: route,
      })
    }
    //<div style={{display: 'flex', flexDirection: 'row'}}>
    return (
      <div className="app">
        <div className="taskbars">
          <SearchBar/>
        </div>
        <PreviewMenu />
        <div>
          <Tooltip />
          <SideMenu />
          <div style={{position: 'absolute', left: '26px'}}>
            {router.resolve(routes, route || this.props.history.location.hash)}
          </div>
        </div>
        <TableMenu db={this.props.db} />
        <ColumnMenu db={this.props.db} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDistpatchToProps)(avec(ROUTE,App));
