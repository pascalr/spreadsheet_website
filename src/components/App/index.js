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
      tables: [],
      tables2: {},
      tablesValues: [],
      table_defs: [],
      table_defs_values: [],
    };
    this.loadTablesWithFirebase()
  }

  loadTablesWithFirebase() { 
    // BIG FIXME: L'ordre ici est important pour que ca marche
    // et ca ne devrait pas parce qu'il y a aucune garantie.
    this.props.firebase.tables().once('value').then((snapshot) => (
      this.setState({
        tables: Object.keys(snapshot.val()),
        tablesValues: Object.values(snapshot.val()),
        tables2: snapshot.val(),
      })
      // Object.keys(snapshot.val()).map
    ))
    this.props.firebase.table_defs().once('value').then((snapshot) => (
      this.setState({
        table_defs: Object.keys(snapshot.val()),
        table_defs_values: Object.values(snapshot.val()),
      })
      // Object.keys(snapshot.val()).map
    ))
  }

  renderTables = () => (
    <div className="tables">
      <DatasheetTable name="TODO"
                      background_color="yellow"
                      grid = {[
                        [{value:  "Mettre a jour mes contacts"}],
                        [{value:  "Pouvoir ecrire en francais"}],
                        [{value:  "Prendre mon vieux vimrc"}]
                      ]}
      />
      <DatasheetTable name="Notes"
                      grid = {[
                        [{value:  1}, {value: 3}],
                        [{value:  2}, {value: 3}]
                      ]}
      />
      <DatasheetTable name="Videos" />
      <DatasheetTable name="Emails" />
      <DatasheetTable name="Bookmarks" />
      {this.state.table_defs.map((object,i) => {
        let firstLine = [{readOnly: true, value:""}, // top left corner is blank
                         ...this.state.table_defs_values[i]["columns"].map((col, j) => (
                              {value: col}
                         ))];
        let dataLines = (this.state.tables2[object] ?
                            this.state.tables2[object].map((table, j) => (
                            [{readOnly: true, value:j},{value: "test"},{value: "test"}] // line number
                          )) : [[{readOnly: true, value:1},{value: ""}]])
        let grid = [firstLine, ...dataLines].filter(function (el) {
          return el != null;
        }); // FIXME: maybe useless...
        let z = this;
        return (
        <DatasheetTable key = {i}
                        name = {object}
                        grid = {grid}
        />
      )})}
    </div>
  )
 //                       grid={this.state.tablesValues[i].map((table,j) => (
 //                         Object.values(table).map((val) => ({value: val}))
 //                       ))}

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
