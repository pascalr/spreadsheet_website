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

import { Item, Separator, Submenu } from 'react-contexify'
import { InlineMenu, withMenu } from '../Menu'

import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

// A-Z, AA-ZZ, AAA-ZZZ
function lettersFromColumnNumber(colNb) {
      //name: String.fromCharCode(65 + columns.length),
}

function nextTableName(defs) {
  debugger
  let defsByName = defs.reduce((acc,currVal) => {
    acc[currVal.name] = currVal
    return acc
  }, {})
  let i = 1;
  while (defsByName["table" + i]) {i++}
  return "table" + i
}

const onClickMenu = ({ event, props }) => console.log(event,props);

// I need to have a list of all tables to be able to access it.
// It belongs in App I think
//
// App needs a hashmap of tables and tableDefs,
// but the grid and 
//
// Ah! Ah! Je pense que j'ai trouve la solution:
// Vu que les props des autres tables ne changent pas, elles ne seront pas re-render!
// Alors oui je peux updater le state de l'App au complet pour une table seulement!
class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      tables: {},
      tableDefs: [],
    };
    this.loadTablesWithFirebase()
  }
  
  /*addRow = (table, tableDef) => {
    let tables = Object.assign({},this.state.tables)
    let rows = tables[tableDef.name]
    let emptyLine = new Array(tableDef.columns.length).fill("")
    if (rows) {
      rows.push(emptyLine)
    } else {
      tables[tableDef.name] = [emptyLine]
    }
    this.setState({tables: tables})
  }*/

  addColumn = (tableDef) => {
    let defs = [...this.state.tableDefs]
    let columns = defs.find(el => (el.name == tableDef.name)).columns
    columns.push({
      name: String.fromCharCode(65 + columns.length),
      type: "",
    })
    this.props.firebase.tableDefs().set(defs)
    this.setState({tableDefs: defs})
  }

  handleColumnDrop = def => (from, to) => {
    let defs = [...this.state.tableDefs]
    let columns = [...defs.find(el => (el.name == def.name)).columns]
    columns.splice(to, 0, ...columns.splice(from, 1))
    defs.find(el => (el.name == def.name)).columns = columns
    this.props.firebase.tableDefs().set(defs)
    this.setState({tableDefs: defs})
  }
  
  onCellsChanged = (changes, tableDef) => {
    let tables = Object.assign({},this.state.tables)
    changes.forEach(({cell, row, col, value}) => {
      if (!tables[tableDef.name]) {
        tables[tableDef.name] = []
      }
      let val = tables[tableDef.name][row]
      if (!val) {
        let empty = tableDef.columns.reduce((acc,currVal) => {acc[currVal.name] = ""; return acc}, {})
        tables[tableDef.name][row] = empty
        val = empty
      }
      if (tableDef.showLineNumbers != false) {
        val[tableDef.columns[col-1].name] = value
      } else {
        val[tableDef.columns[col].name] = value
      }
      this.props.firebase.tableRow(tableDef.name,row).set(val) // TODO: set all at once maybe
    })
    this.setState({tables: tables})
  }

  loadTablesWithFirebase() { 
    this.props.firebase.tableDefs().on('value', (snapshot) => (
      this.setState({tableDefs: snapshot.val()})
    ))
    this.props.firebase.tables().on('value', (snapshot) => (
      this.setState({tables: snapshot.val()})
    ))
  }

  renderTables = () => {
    // TODO: Loading layout first
    // if !layoutLoaded, <span>Loading layout</span>
    return (
    <div className="tables">
      <GridLayout className="layout"
                  verticalCompact={false}
                  cols={12}
                  autoSize={false}
                  onLayoutChange={(layout) => (undefined)/*TODO*/}
                  rowHeight={30}
                  width={1200}>
        {this.state.tableDefs
          .filter(el => (el ? true : false))
          .map((def,i) => (
            <div key={"gridTable_" + def.name}
                 data-grid={{x: 0, y: 0, w: 5, h: 5}}
                 className="gridTable"
            >
              <span>aaaaa</span>  
              <span>bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb</span>  
            <DatasheetTable key={i}
                            tableDef={def}
                            table={this.state.tables[def.name]}
                            doAddColumn={this.addColumn}
                            onCellsChanged={this.onCellsChanged}
                            onColumnDrop={this.handleColumnDrop}
                          />
            </div>
        ))}
      </GridLayout>
    </div>
  )}

  updateTableDefs = () => {
    let defs = [...this.state.tables["table_defs"]].filter((el) => ( el && el.name && el.name !== "" ));
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
    this.props.firebase.tableDefs().set(defs)
  }

  addNewTable = () => {
    const defs = [...this.state.tableDefs]
    defs.push({name: nextTableName(defs), columns: [{name: "A"}], showLineNumbers: true})
    this.props.firebase.tableDefs().set(defs)
    this.setState({tableDefs: defs})
  }

  appMenuItems = () => (
    <React.Fragment>
      <Item onClick={this.addNewTable}>add table</Item>
      <Separator />
      <Submenu label="Foobar">
        <Item onClick={onClickMenu}>Foo</Item>
        <Item onClick={onClickMenu}>Bar</Item>
      </Submenu>
    </React.Fragment>
  )

  render = () => {
    return (
    <InlineMenu id="app_menu_id" items={this.appMenuItems()}>
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
            <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
            <Route path={ROUTES.ACCOUNT} component={AccountPage} />
          </div>
        </Router>
        {this.renderTables()}
      </div>
    </InlineMenu>
  );}
}

export default withAuthentication(withFirebase(App));
