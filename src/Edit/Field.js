import React from 'react'
import {connect} from 'react-redux'

import {set} from '../actions'

const mapStateToProps = state => ({
})

const mapDispatchToProps = (dispatch) => ({
  set: (path, val) => dispatch(set(path, val))
})

class Field extends React.Component {
  constructor(props) {
    super(props);
    this.state = {key: '', value: ''};
  }

  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.set([this.props.table, this.state.key], this.state.value)
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          key:
          <input type="text" name='key' value={this.state.key} onChange={this.handleChange} />
        </label>
        <label>
          value:
          <input type="text" name='value' value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Add field" />
      </form>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Field);
