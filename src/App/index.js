import React from 'react'

import { connect } from "react-redux";
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

import Firebase from '../Firebase'
import Helper from '../Helper'

import DefinitionsProvider from '../DefinitionsProvider'

import { MenuProvider } from 'react-contexify'

import * as TABLES from '../constants/tables'

import 'react-contexify/dist/ReactContexify.min.css';

import '../styles/react-grid-layout-style.css'
import 'react-resizable/css/styles.css'

import ScreenMenu from '../ScreenMenu';

import Home from '../views/home'
import Tables from '../views/tables'
import ShowTable from '../views/tables/show'

import TablesGridLayout from '../TablesGridLayout'

class Screen extends React.Component {
  constructor(props) {
    super(props)

    this.props.db.load(TABLES.SCREEN,
      (screen) => (this.setState(screen)))
    this.state = {tables: {}}
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState != this.state) {
      // Keep the state of the screen in the database
      this.props.db.set(TABLES.SCREEN,this.state);
    }
  }

  addTable = (tableName) => ({ event, props }) => {
    const tables = {...this.state.tables}
    tables[tableName] = true
    this.setState({tables: tables})
  }

  render() {
    return (
      <React.Fragment>
        <MenuProvider id="screen_menu" data={{test2: 12}} className="screen_menu">
          <div id="screen">
            <TablesGridLayout db={this.props.db} tables={this.state.tables}/>
          </div>
        </MenuProvider>
        <ScreenMenu {...this.props} screen={this} />
      </React.Fragment>
    );
  }
}

function Landing() {
  return (
    <DefinitionsProvider db={this.props.db}>
      <Screen db={this.props.db}/>
    </DefinitionsProvider>
  );
}

class ImprovedApp extends React.Component {
  actionTemp = () => {
    this.props.db.load("tableDefs", (oldDefs) => {
      let defsByName = oldDefs.reduce((acc,currVal) => {
        currVal["type"] = null;
        let name = currVal.name;
        currVal["name"] = null;
        acc[name] = currVal;
        return acc;
      }, {})
      this.props.db.set(TABLES.DEFS,defsByName)
    })
    return undefined
  }
  render() {
    return(
      <Router>
        <React.Fragment>
          <React.Fragment>
            <Route exact path="/" render={props => (
              <DefinitionsProvider db={this.props.db}>
                <Screen db={this.props.db}/>
              </DefinitionsProvider>
            )}/>
            <Route path={`/tables/:id`} component={ShowTable} />
          </React.Fragment>
          <button onClick={this.actionTemp}>
            Bouton d'action temporaire
          </button>
        </React.Fragment>
      </Router>
    );
  }
}

export default ImprovedApp;
