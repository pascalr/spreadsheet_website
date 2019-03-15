import React from "react"

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function Tables({ match }) {
  return (
    <div>
      <h2>Tables</h2>
      <Route
        exact
        path={match.path}
        render={() => <h3>Please select a table.</h3>}
      />
    </div>
  );
}

export default Tables;
