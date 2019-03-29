import React, {useState} from 'react'
import _ from 'lodash'
import { connect } from "react-redux"
import { MenuProvider } from 'react-contexify'
import DesktopGridLayout from '../DesktopGridLayout'
import { modelLoaded } from '../actions'
import ScreenMenu from '../menus/ScreenMenu'
import LinkMenu from '../menus/LinkMenu'
import * as TABLES from '../constants/tables'
import { MapInteraction } from 'react-map-interaction'
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

/*
  This component provides a map like interaction to any content that you place in it. It will let
  the user zoom and pan the children by scaling and translating props.children using css.
*/
const MapInteractionCSS = (props) => {
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [lastScale, setLastScale] = useState(0);
  return (
    <MapInteraction {...props}>
      {
        ({ translation, scale }) => {
          if (!props.disabled) {
            setLastX(translation.x)
            setLastY(translation.y)
            setLastScale(scale)
          }
          // Translate first and then scale.  Otherwise, the scale would affect the translation.
          const transform = `translate(${lastX}px, ${lastY}px) scale(${lastScale})`;
          return (
            <div
              style={{
                height: '100%',
                width: '100%',
                position: 'relative', // for absolutely positioned children
                overflow: 'hidden',
                touchAction: 'none', // Not supported in Safari :(
                msTouchAction: 'none',
                cursor: 'all-scroll',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none'
              }}
            >
              <div
                style={{
                  transform: transform,
                  transformOrigin: '0 0 '
                }}
              >
                {props.children}
              </div>
            </div>
          );
        }
      }
    </MapInteraction>
  );
};

class LinkScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {mapDisabled: false}
  }
  
  componentDidMount = () => {
    this.props.db.load(TABLES.SCREEN, this.props.modelLoaded)
  }

  componentDidUpdate = (prevProps, prevState) => {
  }

  render() {
    const tables = this.props.defs
    return (
      <ByPass if={this.props.editMode}>
        <MapInteractionCSS showControls={true} disabled={this.state.mapDisabled}>
          <React.Fragment>
            <MenuProvider id="link_screen_menu">
              <div id="screen" className={this.props.editMode ? "editMode" : "notEditMode"}
                style={{width: 1920, height: 1024}}>
                {
                  _.keys(this.props.screen).map((e,i) => (
                    <div key={i}
                      onMouseEnter={() => this.setState({mapDisabled: true})}
                      onMouseLeave={() => this.setState({mapDisabled: false})}
                    >
                      <LinkItem id={e}
                        desc={this.props.screen[e].desc}
                        linkRef={this.props.screen[e].ref}/>
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
