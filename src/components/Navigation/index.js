import React from 'react';
import { Link } from 'react-router-dom';
import { AuthUserContext } from '../Session';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';

const Navigation = ({ authUser }) => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </div>
);

const NavigationAuth = () => (
  <React.Fragment>
    <Link to={ROUTES.LANDING}>Landing</Link>
    <Link to={ROUTES.HOME}>Home</Link>
    <Link to={ROUTES.ACCOUNT}>Account</Link>
    <Link to={ROUTES.ADMIN}>Admin</Link>
    <SignOutButton />
  </React.Fragment>
);

const NavigationNonAuth = () => (
  <React.Fragment>
    <Link to={ROUTES.LANDING}>Landing</Link>
    <Link to={ROUTES.SIGN_IN}>Sign In</Link>
  </React.Fragment>
);

export default Navigation;
