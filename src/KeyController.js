import React from 'react'
import _ from 'lodash'
import {withDispatch} from './contexts'
import * as TABLE from './constants/tables'

class KeyController extends React.Component {
  constructor(props) {
    super(props)
  }
  
  onKeyUp = (e) => {
    // Delete key deletes selected previews
    if (e.which === 46) {
      this.state.selection.forEach(s => {
        //this.props.deletePath(this.props.db,[TABLE.PREVIEW,s])
        this.props.dispatchDelete([TABLE.PREVIEW,s])
      })
    }
  }

  render = () => {
    return (
      <div tabIndex='0' onKeyUp={this.onKeyUp}>
        {this.props.children}
      </div>
    );
  }
}

export default withDispatch(KeyController)
