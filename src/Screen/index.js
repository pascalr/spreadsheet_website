import React from 'react'
import { connect } from "react-redux"

import { MenuProvider } from 'react-contexify'

import DesktopGridLayout from '../DesktopGridLayout'

import { modelLoaded } from '../actions'

import ScreenMenu from './ScreenMenu'

import * as TABLES from '../constants/tables'

const mapStateToProps = state => ({
  db: state.db,
  editMode: state.ui.editMode,
  tables: ((state.cache.screen || {}).tables || {}),
  screen: state.cache.screen,
})

const mapDispatchToProps = dispatch => ({
  modelLoaded: (model) => dispatch(modelLoaded(TABLES.SCREEN, model))
})

class Screen extends React.Component {
  
  componentDidMount = () => {
    this.props.db.load(TABLES.SCREEN, this.props.modelLoaded)
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState !== this.state) {
      // Keep the state of the screen in the database
      this.props.db.set(TABLES.SCREEN,this.props.screen);
    }
  }

  render() {
    return (
      <React.Fragment>
        <MenuProvider id="screen_menu" data={{test2: 12}} className="screen_menu">
          <div id="screen" className={this.props.editMode ? "editMode" : "notEditMode"}>
            <DesktopGridLayout db={this.props.db} tables={this.props.tables}/>
          </div>
        </MenuProvider>
        <ScreenMenu {...this.props} screen={this.props.screen} />
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Screen);
