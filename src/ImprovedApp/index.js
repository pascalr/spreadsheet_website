import React from 'react'

import Firebase from '../Firebase'
import Helper from '../Helper'

import DefinitionsProvider from '../DefinitionsProvider'

import { Menu, Item, Separator, Submenu, MenuProvider } from 'react-contexify'
import * as TABLES from '../constants/tables'

import 'react-contexify/dist/ReactContexify.min.css';

import GridLayout from 'react-grid-layout';
import '../styles/react-grid-layout-style.css'
import 'react-resizable/css/styles.css'

const onClickMenu = ({ event, props }) => console.log(event,props);

class Table extends React.Component {
  constructor(props) {
    super(props)

    //this.props.db.loadRecord(TABLES.TABLES,props.name,
    //  (data)=>(this.setState({data: data})))
    //this.state = {data: {}}
  }
  render() {
    return (
      <div>
        {this.props.name}
      </div>
    );
  }
}

class ScreenMenu extends React.Component {
  render() {
    return(
      <Menu id="screen_menu">
        <Submenu label="add table">
          <Item onClick={onClickMenu}><input type='text' /></Item>
          {Object.keys(this.props.defs || {}).map(d => (
            <Item onClick={this.props.screen.addTable(d)} key={d}>{d}</Item>
          ))}
        </Submenu>
        <Item onClick={this.props.defsHandler.newTable} data={{test: 10}}>new table</Item>
      </Menu>
    );
  }
}

class TablesGridLayout extends React.Component {
  constructor(props) {
    super(props)

    this.props.db.load(TABLES.LAYOUT,
      (layout) => (this.setState(layout)))
    this.state = {layout: {}}
  }

  onLayoutChange = (layout) => {
    this.setState({layout: layout})
  }

  render() { return(
    <GridLayout className="layout"
                compactType={null}
                cols={40}
                autoSize={true}
                onLayoutChange={this.onLayoutChange}
                style={{height: '2810px'}}
                margin={[0,0]}
                rowHeight={20}
                width={40*20}>
      {Object.keys(this.props.tables || {}).map(d => (
        <div key={"gridTable_" + d}
          className="gridTable"
          data-grid={{x: 0, y: 0, w: 2, h: 2}}
        >
          <div className="gridTable" style={{width: 20, height: 20}}>
            <Table name={d} key={d}/>
          </div>
        </div>
      ))}
    </GridLayout>
  );}
}

class Screen extends React.Component {
  constructor(props) {
    super(props)

    this.props.db.load(TABLES.SCREEN,
      (screen) => (this.setState(screen)))
    this.state = {tables: {}}
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState != this.state) {
      // Keep the state of the screen in the database
      this.props.db.set(TABLES.SCREEN,this.state);
    }
  }

  addTable = (tableName) => ({ event, props }) => {
    const tables = {...this.state.tables}
    tables[tableName] = true
    this.setState({tables: tables})
  }

  render() {
    return (
      <React.Fragment>
        <MenuProvider id="screen_menu" data={{test2: 12}}>
          <div id="screen">
            <TablesGridLayout db={this.props.db} tables={this.state.tables}/>
          </div>
        </MenuProvider>
        <ScreenMenu {...this.props} screen={this} />
      </React.Fragment>
    );
  }
}

class ImprovedApp extends React.Component {
  actionTemp = () => {
    this.props.db.load("tableDefs", (oldDefs) => {
      let defsByName = oldDefs.reduce((acc,currVal) => {
        currVal["type"] = null;
        let name = currVal.name;
        currVal["name"] = null;
        acc[name] = currVal;
        return acc;
      }, {})
      this.props.db.set(TABLES.DEFS,defsByName)
    })
    return undefined
  }
  render() {
    return(
      <React.Fragment>
        <DefinitionsProvider db={this.props.db}>
          <Screen db={this.props.db}/>
        </DefinitionsProvider>
        <button onClick={this.actionTemp}>
          Bouton d'action temporaire
        </button>
      </React.Fragment>
    );
  }
}

export default ImprovedApp;
