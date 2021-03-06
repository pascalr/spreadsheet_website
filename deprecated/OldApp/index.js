import React from 'react';
import './App.css';
import DatasheetTable from '../DatasheetTable';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import * as ROUTES from '../constants/routes';

import { Item, Separator, Submenu } from 'react-contexify'

import Firebase from '../Firebase'
import Helper from '../Helper'

import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

import ByPass from '../lib/ByPass'

// A-Z, AA-ZZ, AAA-ZZZ
function lettersFromColumnNumber(colNb) {
      //name: String.fromCharCode(65 + columns.length),
}

const ROW_HEIGHT = 20;

const onClickMenu = ({ event, props }) => console.log(event,props);

class App extends React.Component {

  constructor(props) {
    super(props);

    console.log('In app constructor');
    this.db = new Firebase()
    this.db.loadTables(tables => (this.setState({tables: tables})))
    this.db.loadTableDefs(defs => (this.setState({tableDefs: defs})))

    this.state = {
      tables: {},
      tableDefs: [],
    };
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
  
  onCellsChanged = tableDef => (changes, additions) => {
    let tables = Object.assign({},this.state.tables)
    changes.concat(additions || []).forEach(({cell, row, col, value}) => {
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

    /*handleCellsChanged (changes, additions) { TODO: Additions
    const grid = this.state.grid.map(row => [...row])
    changes.forEach(({cell, row, col, value}) => {
      grid[row][col] = {...grid[row][col], value}
    })
    // paste extended beyond end, so add a new row
    additions && additions.forEach(({cell, row, col, value}) => {
      if (!grid[row]) {
        grid[row] = [{value: ''}, {value: ''}, {value: ''}, {value: 0}]
      }
      if (grid[row][col]) {
        grid[row][col] = {...grid[row][col], value}
      }
    })
    this.setState({grid})
  }*/

  dataGridLayout(def, table) {
    console.log('dataGridLayout')
    let layout = null
    if (table) {
      let nbRows = Object.keys(table).length
      console.log(`h:${Math.ceil(nbRows + 2)}`)
      layout = {x: 0, y: 0, w: 5, h: nbRows+2}
    } else {
      layout = {x: 0, y: 0, w: 5, h: 5}
    }
    layout["i"] = "gridTable_" + def.name
    return layout
  }

  dataGridLayouts = () => {
    let v = (this.state.tableDefs.map(e => (this.dataGridLayout(e, this.state.tables[e.name]))))
    return v
  }

  renderTables = () => {
    // TODO: Loading layout first
    // if !layoutLoaded, <span>Loading layout</span>
    // data-grid={this.dataGridLayout(this.state.tables[def.name])}
    let layout = [...this.dataGridLayouts()]
    return (
      <div className="tables">
      <ByPass>
      <GridLayout className="layout"
                  compactType={null}
                  cols={12}
                  layout={layout}
                  autoSize={true}
                  onLayoutChange={(layout) => (undefined)/*TODO*/}
                  draggableHandle=".rCaption"
                  style={{height: '2810px'}}
                  rowHeight={21}
                  width={1920}>
        {this.state.tableDefs
          .filter(el => (el ? true : false))
          .map((def,i) => (
            <div key={"gridTable_" + def.name}
                 className="gridTable"
            >
            <DatasheetTable key={i}
                            tableDef={def}
                            table={this.state.tables[def.name]}
                            doAddColumn={this.addColumn}
                            doDeleteTable={this.deleteTable}
                            doDeleteColumn={this.deleteColumn}
                            onCellsChanged={this.onCellsChanged}
                            onColumnDrop={this.handleColumnDrop}
                          />
            </div>
        ))}
      </GridLayout>
      </ByPass>
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

  /* --- Menu callbacks --- */

  addNewTable = () => {
    const defs = [...this.state.tableDefs]
    defs.push({name: Helper.nextTableName(defs), columns: [{name: "A"}], showLineNumbers: true})
    this.props.firebase.tableDefs().set(defs)
    this.setState({tableDefs: defs})
  }

  deleteTable = (def) => {
    // TODO: Delete table too...
    const defs = this.state.tableDefs.filter(e => e.name !== def.name)
    this.props.firebase.tableDefs().set(defs)
    this.setState({tableDefs: defs})
  }
  
  deleteColumn = (tableDef, col) => {
    // TODO: Delete in table too...
    const defs = [...this.state.tableDefs]
    const def = this.state.tableDefs.filter(e => e.name === tableDef.name)[0]
    const filter = def.columns.filter(e => e !== col)
    def.columns = filter
    this.props.firebase.tableDefs().set(defs)
    this.setState({tableDefs: defs})
  }
  
  /* --- End menu callbacks --- */

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
      <div>
        <Router>
          <div>
            {/*<hr />
            <Route exact path={ROUTES.LANDING} component={LandingPage} />
            <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
            <Route path={ROUTES.SIGN_IN} component={SignInPage} />
            <Route path={ROUTES.ADMIN} component={AdminPage} />
            <Route path={ROUTES.HOME} component={HomePage} />
            <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
            <Route path={ROUTES.ACCOUNT} component={AccountPage} />*/}
          </div>
        </Router>
        {this.renderTables()}
      </div>
  );}
}

export default App;
