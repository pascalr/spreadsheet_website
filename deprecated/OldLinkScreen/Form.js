import React from 'react'
import {connect} from 'react-redux'

import {set} from '../actions'

const mapStateToProps = state => ({
})

const mapDispatchToProps = (dispatch) => ({
  set: (path, val) => dispatch(set(path, val))
})

class Field extends React.Component {
  render() {
    console.log(`name = ${this.props.name}, val = ${this.props.val}`)
    return (
      <label>
        {this.props.name}:
        {this.props.val ?
          <input type="text"
            name={this.props.name}
            value={this.props.val}
            onChange={this.props.handleChange} /> :
          <input type="text"
            name={this.props.name}
            value={" "/*FIXME: DOES NOT WORK. It does value, not value=""*/}
            onChange={this.props.handleChange} />}
      </label>
    );
  }
}

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.fields.reduce((acc,v) => {
      acc[v] = props.values[v] || '';
      return acc;
    },{})
  }

  handleChange = (event) => {
    debugger
    console.log(`name = ${event.target.name}, rref = ${event.target.rref}`)
    this.setState({[event.target.name]: event.target.rref});
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onSubmit(event);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.props.fields.map((f,i) => (
          <Field key={i}
            name={f}
            val={this.state[f]}
            handleChange={this.handleChange}/>
        ))}
        <input type="submit" value="Update" />
      </form>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
