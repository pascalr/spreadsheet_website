import React from 'react'
import _ from 'lodash'
import {avec, MOUSE_ACTION, MOUSE_ACTION_DRAG, MOUSE_ACTION_COLOR,
  MOUSE_ACTION_RESIZE, MOUSE_ACTION_ADD} from './contexts'
import Tooltip from './Tooltip'

class MouseController extends React.Component {
  constructor(props) {
    super(props)
  }

  onKeyUp = e => {
    // Esc key sets mouse action to none
    if (e.which === 27) {
      this.props.cache(MOUSE_ACTION, 'none')
    }
  }
  
  render = () => {
    const style = {}
    if (_.get(this.props, MOUSE_ACTION) === MOUSE_ACTION_DRAG) {
      style.cursor = 'move'
    } else if (_.get(this.props, MOUSE_ACTION) === MOUSE_ACTION_RESIZE) {
      style.cursor = 'nesw-resize'
    } else if (_.get(this.props, MOUSE_ACTION) === MOUSE_ACTION_ADD) {
      style.cursor = 'copy'
    } else if (_.get(this.props, MOUSE_ACTION) === MOUSE_ACTION_COLOR) {
      style.cursor = 'url(\'paintbrushCursor.png\'), auto'
    }
    
    //style.cursor = 'wait'

    return (
      <div style={style} onKeyUp={this.onKeyUp}>
        {this.props.children}
      </div>
    )
  }
}

export default avec(MOUSE_ACTION, MouseController)
