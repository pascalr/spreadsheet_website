import React from 'react'
import { connect } from "react-redux"
import _ from 'lodash'
import * as TABLE from './constants/tables'
import { set } from "./actions"
import * as PATH from './constants/paths'

const mapStateToProps = state => ({
  db: state.db,
})

const mapDistpatchToProps = dispatch => ({
  set: (path, val) => dispatch(set(path,val)),
})

// Loading takes a db, a path, and a callback to render
// TODO: Set loading on task bar to loading...
// TODO: Validate correct props
class Loading extends React.Component {
  constructor(props) {
    super(props)
    this.state = {loaded: false}
  }

  componentDidMount() {
    this.props.set([...PATH.UI_LOADING, this.props.path.slice(-1)], true)
    this.props.db.get(this.props.path, (val) => {
      this.props.set([...PATH.UI_LOADING, this.props.path.slice(-1)], false)
      this.props.set(this.props.path, val)
      this.setState({loaded: true, val})
    })
  }

  render() {
    if (!this.state.loaded) { return null }
    return this.props.children
  }
}

export default connect(mapStateToProps, mapDistpatchToProps)(Loading);
