import React from 'react';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';

const Navigation = () => (
  <div className="navigation">
    <Link to={ROUTES.SIGN_IN}>Sign In</Link>
    <Link to={ROUTES.LANDING}>Landing</Link>
    <Link to={ROUTES.HOME}>Home</Link>
    <Link to={ROUTES.ACCOUNT}>Account</Link>
    <Link to={ROUTES.ADMIN}>Admin</Link>
  </div>
);

export default Navigation;
