import React from 'react'
import { connect } from "react-redux"
import _ from 'lodash'

const mapStateToProps = state => ({
  db: state.db,
})

const mapDistpatchToProps = dispatch => ({
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
    this.props.db.get(this.props.path, (val) => {
      this.setState({loaded: true, val})
    })
  }

  render() {
    return this.state.loaded ? this.props.callback(this.state.val) : null
  }
}

export default connect(mapStateToProps, mapDistpatchToProps)(Loading);
