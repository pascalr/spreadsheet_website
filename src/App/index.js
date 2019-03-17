import React from 'react'
import { connect } from "react-redux";

import {BrowserRouter as Router, Route} from 'react-router-dom';

import {Link} from 'react-router-dom';

import 'react-contexify/dist/ReactContexify.min.css';
import '../styles/react-grid-layout-style.css'
import 'react-resizable/css/styles.css'

import * as TABLES from '../constants/tables'

import { defsLoaded } from '../actions'

import Landing from '../Landing'
import Table from '../Table'

const mapStateToProps = state => ({
  db: state.db
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
    return(
      <Router>
        <React.Fragment>
          <Link to={'/'}>Home</Link>
          <Route exact path="/" component={Landing}/>
          <Route path={`/tables/:id`} render={props => (<Table {...props} />)} />
        </React.Fragment>
      </Router>
    );
  }
}

export default connect(mapStateToProps, mapDistpatchToProps)(ImprovedApp);
