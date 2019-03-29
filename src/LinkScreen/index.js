import React from 'react'
import _ from 'lodash'
import { connect } from "react-redux"
import { MenuProvider } from 'react-contexify'
import DesktopGridLayout from '../DesktopGridLayout'
import { modelLoaded } from '../actions'
import ScreenMenu from '../menus/ScreenMenu'
import LinkMenu from '../menus/LinkMenu'
import * as TABLES from '../constants/tables'
import { MapInteractionCSS } from 'react-map-interaction'
import LinkItem from './LinkItem'
import ByPass from '../lib/ByPass'

const mapStateToProps = state => ({
  db: state.db,
  editMode: state.ui.editMode,
  screen: state.cache.screen,
})

const mapDispatchToProps = dispatch => ({
  modelLoaded: (model) => dispatch(modelLoaded(TABLES.SCREEN, model))
})

class LinkScreen extends React.Component {
  
  componentDidMount = () => {
    this.props.db.load(TABLES.SCREEN, this.props.modelLoaded)
  }

  componentDidUpdate = (prevProps, prevState) => {
  }

  render() {
    const tables = this.props.defs
    return (
      <ByPass if={this.props.editMode}>
        <MapInteractionCSS showControls={true}>
          <React.Fragment>
            <MenuProvider id="link_screen_menu">
              <div id="screen" className={this.props.editMode ? "editMode" : "notEditMode"}
                style={{width: 1920, height: 1024}}>
                {
                  _.keys(this.props.screen).map((e,i) => (
                    <div key={i}>
                      <LinkItem id={e}
                        desc={this.props.screen[e].desc}
                        ref={this.props.screen[e].ref}/>
                    </div>
                  ))
                }
              </div>
            </MenuProvider>
            <ScreenMenu {...this.props} screen={this.props.screen} />
            <LinkMenu />
          </React.Fragment>
        </MapInteractionCSS>
      </ByPass>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LinkScreen);
