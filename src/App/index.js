import React from 'react'
import { connect } from "react-redux";

import {BrowserRouter as Router, Route, withRouter, Redirect} from 'react-router-dom';

import Link from '../Link';

import 'react-contexify/dist/ReactContexify.min.css';
import '../styles/react-grid-layout-style.css'
import 'react-resizable/css/styles.css'

import * as TABLES from '../constants/tables'

import { defsLoaded } from '../actions'

import Table from '../Table'
import Screen from '../Screen'
import Edit from '../Edit'

import router from '../router'

const uuidv1 = require('uuid/v1');

const mapStateToProps = state => ({
  db: state.db,
  history: state.history,
})

const mapDistpatchToProps = dispatch => ({
  defsLoaded: defs => dispatch(defsLoaded(defs))
})

const routes = [
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

function addUUIDS(db) {
  db.load(TABLES.TABLES, (tables) => {
    const withUUID = Object.keys(tables).reduce((acc,k) => {
      const id = uuidv1();
      acc[id] = tables[k];
      return acc;
    }, {})
    db.set(TABLES.TABLES2, withUUID);
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
  componentWillMount = () => {
    const location = this.props.history.location;
    this.unlisten = this.props.history.listen((location, action) => {
      this.setState({path: location.pathname})
    });
    // Use push, replace, and go to navigate around.
    //this.props.history.push('/', { some: 'state' });
  }
  componentWillUnmount = () => {
    this.unlisten();
  }
  render() {
    return (
      <div className="app">
        <Link to='/'>Home</Link>
        <hr />
        <button onClick={() => generateDefs(this.props.db)}>gen defs</button>
        <button onClick={() => addUUIDS(this.props.db)}>add uuids</button>
        {router.resolve(routes, this.props.history.location)}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDistpatchToProps)(App);
