import React from 'react';
import './App.css';
import DatasheetTable from '../DatasheetTable';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import { withFirebase } from '../Firebase';
import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';

import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      tables: {},
      tableDefs: {},
      tableDefs2: {},
    };
    this.loadTablesWithFirebase()
  }

  loadTablesWithFirebase() { 
    // BIG FIXME: L'ordre ici est important pour que ca marche
    // et ca ne devrait pas parce qu'il y a aucune garantie.
    this.props.firebase.tables().on('value', (snapshot) => (
      this.setState({tables: snapshot.val()})
    ))
    this.props.firebase.tableDefs().on('value', (snapshot) => (
      this.setState({tableDefs: snapshot.val(),tableDefs2: snapshot.val()})
    ))
  }

  renderTables = () => (
    <div className="tables">
      {Object.keys(this.state.tableDefs).map((name,i) => {
        let columns = this.state.tableDefs[name]["columns"]
        let firstLine = null;
        let dataLines = null;
        if (this.state.tableDefs[name]["showLineNumbers"] != false) {
          firstLine = [{readOnly: true, value:""}, // top left corner is blank
                           ...columns.map((col, j) => (
                                {readOnly: true, value: col.name}
                           ))];
          dataLines = (this.state.tables[name] || []).map((table, j) => (
                                [{readOnly: true, value:j},
                                  ...columns.map(col => ({value: table[col.name]}) )
                                ]
                            ))
        } else {
          firstLine = columns.map((col, j) => (
                                {readOnly: true, value: col.name}
                           ))
          dataLines = (this.state.tables[name] || []).map((table, j) => (
                                  columns.map(col => ({value: table[col.name]}) )
                            ))
        }
        let grid = [firstLine, ...dataLines].filter((el) => ( el != null ));
        let emptyLine = new Array(grid[0].length).fill({value: ""})
        if (this.state.tableDefs[name]["showLineNumbers"] != false) {
          emptyLine[0] = {readOnly: true, value: grid.length}
        }
        // Add an empty line
        let c = (<DatasheetTable key={i}
                                name={name}
                                grid={[...grid, emptyLine]}
                                table_def={this.state.tableDefs[name]}
                                tables={this.state.tables}
                                background_color={this.state.tableDefs[name]["backgroundColor"]}
          />)
        return c
      })}
    </div>
  )

  updateTableDefs = () => {
    let defs = [...this.state.tables["table_defs"]].filter((el) => ( el != null ));
    let defsByName = defs.reduce((acc,currVal) => {
      acc[currVal.name] = currVal
      return acc
    }, {})
    let columns = [...this.state.tables["table_def_columns"]].filter((el) => ( el != null ));
    Object.values(columns).forEach(col => {
      if (col) {
        let def = defsByName[col["table_def"]]
        if (def) {
          if (def["columns"]) {
            def["columns"] = [...def["columns"], col]
          } else {
            def["columns"] = [col]
          }
        }
      }
    })
    this.props.firebase.tableDefs2().set(defs)
  }

  render() {
    return (
      <div>
        <Router>
          <div>
            <Navigation />

            <hr />

            <Route exact path={ROUTES.LANDING} component={LandingPage} />
            <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
            <Route path={ROUTES.SIGN_IN} component={SignInPage} />
            <Route path={ROUTES.ADMIN} component={AdminPage} />
            <Route path={ROUTES.HOME} component={HomePage} />
            <Route
              path={ROUTES.PASSWORD_FORGET}
              component={PasswordForgetPage}
            />
            <Route path={ROUTES.ACCOUNT} component={AccountPage} />
          </div>
        </Router>
        {this.renderTables()}
        <button className="updateTables" onClick={this.updateTableDefs}>
          Update tables
        </button>
      </div>
    );
  }
}

export default withAuthentication(withFirebase(App));
