import React from 'react'
import _ from 'lodash'
import {withDispatch} from './contexts'
import Tooltip from './Tooltip'

class MouseController extends React.Component {
  constructor(props) {
    super(props)
    this.state = {menuOpened: false}
  }
  
  render = () => {
    // TODO: Only open menu when it selects something
    return (
      <div onMouseUp={(e) => {
        this.setState({menuOpened: !this.state.menuOpened, x: e.pageX, y: e.pageY})
        console.log('onMouseUp correct')
      }}>
        {this.state.menuOpened ? <Tooltip x={this.state.x} y={this.state.y}/> : null}
        {this.props.children}
      </div>
    );
  }
}

export default withDispatch(MouseController)




