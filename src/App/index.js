import React from 'react'
import { connect } from "react-redux";

import {BrowserRouter as Router, Route, withRouter, Redirect} from 'react-router-dom';

import {Link} from 'react-router-dom';

import 'react-contexify/dist/ReactContexify.min.css';
import '../styles/react-grid-layout-style.css'
import 'react-resizable/css/styles.css'

import * as TABLES from '../constants/tables'

import { defsLoaded } from '../actions'

import Table from '../Table'
import Screen from '../Screen'
import Edit from '../Edit'

const mapStateToProps = state => ({
  db: state.db,
  path: state.path,
})

const mapDistpatchToProps = dispatch => ({
  defsLoaded: defs => dispatch(defsLoaded(defs))
})

class ImprovedApp extends React.Component {
  constructor(props) {
    super(props)

    this.props.db.load(TABLES.DEFS, defs => (this.props.defsLoaded(defs)))
  }
  render() {
    if (this.props.path !== this.props.location.pathname) {
      return <Redirect to={this.props.path} />
    }
    return(
        <React.Fragment>
          <Link to={'/'}>Home</Link>
          <Route exact path="/" component={Screen}/>
          <Route path={`/tables/:id`} render={props => (<Table {...props} />)} />
          <Route path={`/edit/:table`} render={props => (<Edit {...props} />)} />
        </React.Fragment>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDistpatchToProps)(ImprovedApp));
