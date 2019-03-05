import React from 'react';
import './App.css';
import DatasheetTable from '../DatasheetTable';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';

import * as ROUTES from '../../constants/routes';

function loadTables() {
  return (
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
                        [{value:  1}],
                        [{value:  2}]
                      ]}
      />
      <DatasheetTable name="Musique" />
      <DatasheetTable name="Test"
                      grid = {[
                        [{value:  1},{value:  3}],
                        [{value:  2},{value:  4}]
                      ]}
      />
      <DatasheetTable name="Videos" />
      <DatasheetTable name="Emails" />
      <DatasheetTable name="Bookmarks" />
    </div>
  );
}

export default class App extends React.Component {
  render () {
    return (
      <div>
        <Router>
          <div>
            <Navigation />

            <hr />
            <Route exact path={ROUTES.LANDING} component={LandingPage} />
            <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
            <Route path={ROUTES.SIGN_IN} component={SignInPage} />

          </div>
        </Router>
        {loadTables()}
      </div>
    )
  }
}
            /*<Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
            <Route path={ROUTES.HOME} component={HomePage} />
            <Route path={ROUTES.ACCOUNT} component={AccountPage} />
            <Route path={ROUTES.ADMIN} component={AdminPage} />*/
