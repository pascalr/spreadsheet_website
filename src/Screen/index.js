import React from 'react'
import { connect } from "react-redux";

import { MenuProvider } from 'react-contexify'

import DesktopGridLayout from '../DesktopGridLayout'

import ScreenMenu from './ScreenMenu';

import * as TABLES from '../constants/tables'

const mapStateToProps = state => ({
  db: state.db,
  editMode: state.editMode,
})

const mapDispatchToProps = dispatch => ({
})

class Screen extends React.Component {
  constructor(props) {
    super(props)

    this.state = {tables: {}}
  }

  componentDidMount = () => {
    this.props.db.load(TABLES.SCREEN,
      (screen) => (this.setState(screen)))
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState !== this.state) {
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
        <MenuProvider id="screen_menu" data={{test2: 12}} className="screen_menu">
          <div id="screen" className={this.props.editMode ? "editMode" : "notEditMode"}>
            <DesktopGridLayout db={this.props.db} tables={this.state.tables}/>
          </div>
        </MenuProvider>
        <ScreenMenu {...this.props} screen={this} />
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Screen);
