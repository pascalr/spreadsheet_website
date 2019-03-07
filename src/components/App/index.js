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
      table_defs: {}
    };
    this.loadTablesWithFirebase()
  }

  loadTablesWithFirebase() { 
    // BIG FIXME: L'ordre ici est important pour que ca marche
    // et ca ne devrait pas parce qu'il y a aucune garantie.
    this.props.firebase.tables().once('value').then((snapshot) => (
      this.setState({tables: snapshot.val()})
    ))
    this.props.firebase.table_defs().once('value').then((snapshot) => (
      this.setState({table_defs: snapshot.val()})
    ))
  }

  renderTables = () => (
    <div className="tables">
      {Object.keys(this.state.table_defs).map((name,i) => {
        let columns = this.state.table_defs[name]["columns"]
        let firstLine = [{readOnly: true, value:""}, // top left corner is blank
                         ...columns.map((col, j) => (
                              {readOnly: true, value: col.name}
                         ))];
        let dataLines = (this.state.tables[name] || []).map((table, j) => (
                              [{readOnly: true, value:j},
                                ...columns.map(col => ({value: table[col.name]}) )
                              ]
                          ))
        let grid = [firstLine, ...dataLines].filter((el) => ( el != null ));
        let emptyLine = new Array(grid[0].length).fill({value: ""})
        emptyLine[0] = {readOnly: true, value: grid.length}
        // Add an empty line
        return (
        <DatasheetTable key={i}
                        name={name}
                        grid={[...grid, emptyLine]}
                        table_defs={this.state.table_defs}
                        background_color={this.state.table_defs[name]["backgroundColor"]}
          />
      )})}
    </div>
  )

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
      </div>
    );
  }
}

export default withAuthentication(withFirebase(App));
