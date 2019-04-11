import React from 'react'
import _ from 'lodash'
import { connect } from "react-redux"
import Selection from './Selection'

const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => ({
})

class Preview extends React.Component {
  constructor(props) {
    super(props)
  }
  render = () => {
    return (
      null
    );
  }
}

class PreviewSelection extends React.Component {
  constructor(props) {
    super(props)
  }
  render = () => {
    return (
      <Selection>
        {this.props.children}
      </Selection>
    );
  }
}

const connectedPreviewSelection = connect(mapStateToProps,mapDispatchToProps)(PreviewSelection)
export {connectedPreviewSelection as PreviewSelection }
