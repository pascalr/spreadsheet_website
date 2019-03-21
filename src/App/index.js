import React from 'react'
import { connect } from "react-redux";

import {BrowserRouter as Router, Route, withRouter, Redirect} from 'react-router-dom';

import {Link} from 'react-router-dom';

import 'react-contexify/dist/ReactContexify.min.css';
import '../styles/react-grid-layout-style.css'
import 'react-resizable/css/styles.css'

import * as TABLES from '../constants/tables'

import { defsLoaded } from '../actions'

import Table from '../Table'
import Screen from '../Screen'
import Edit from '../Edit'

import router from '../router'

const mapStateToProps = state => ({
  db: state.db,
  path: state.path,
  history: state.history,
})

const mapDistpatchToProps = dispatch => ({
  defsLoaded: defs => dispatch(defsLoaded(defs))
})

const routes = [
  {path: '/', action: () => (<Screen />)},
  {path: '/tables/:id', action: (props) => (<Table {...props} />)},
]

function route(history) {
}

class ImprovedApp extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      path: "/"
    }
  }
  componentWillMount = () => {
    // Get the current location.
    const location = this.props.history.location;
    
    // Listen for changes to the current location.
    this.unlisten = this.props.history.listen((location, action) => {
      // location is an object like window.location
      console.log(action, location.pathname, location.state);
      this.setState({path: location.pathname})
    });


    // Use push, replace, and go to navigate around.
    this.props.history.push('/', { some: 'state' });
  }
  componentWillUnmount = () => {
    this.unlisten();
  }
  render() {
    // FIXME: Redirect should only work when this.props.path changes
    // onPropsChanged probably...
    return router.resolve(routes, this.props.history.location)
    return <div>No route matches</div>
    return(
      <React.Fragment>
          {/*<Link to={'/'}>Home</Link>
          <Route exact path="/" component={Screen}/>
          <Route path={`/tables/:id`} render={props => (<Table {...props} />)} />
          <Route path={`/edit/:table`} render={props => (<Edit {...props} />)} />*/}
        </React.Fragment>
    );
  }
}

export default connect(mapStateToProps, mapDistpatchToProps)(ImprovedApp);
