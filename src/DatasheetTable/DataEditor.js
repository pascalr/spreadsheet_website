import React, { PureComponent } from 'react'
import _ from 'lodash'
import Autocomplete from 'react-autocomplete'
import { COMMANDS } from '../Command'

export default class DataEditor extends PureComponent {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.renderTextArea = this.renderTextArea.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
  }

  componentDidMount () {
    this._input.focus()
  }

  componentDidUpdate () {
    this._input.focus()
  }

  handleChange (e) {
    this.props.onChange(e.target.value)
  }

  textAreaKeyDown = (e) => {
    console.log(e)
    if (e.keyCode === 8 || e.keyCode === 46) {// backspace or delete
      if (this.props.value.length <= 1) {
        this.props.onChange(e.target.value)
      }
    }
  }

  renderTextArea (props) {
    return (<div onKeyDown={this.onKeyDown}>
      <textarea {...props}
        value={this.props.value.slice(1)}
        ref={input => { this._input = input }}
        onChange={(e) => {this.props.onChange('='+e.target.value)}}
        onKeyDown={this.textAreaKeyDown}
      />
    </div>)
  }

  renderList = (props) => {
    /*const { value, onKeyDown } = this.props
    return (
      <div>
        <input
          ref={input => { this._input = input }}
          className='data-editor'
          value={value}
          onKeyDown={onKeyDown}
          onChange={this.handleChange}
        />
        <input
          ref={input => { this._input = input }}
          className='data-editor'
          value={value}
          onKeyDown={onKeyDown}
          onChange={this.handleChange}
        />
      </div>
    )*/
  }

  onKeyDown (e) {
    e.stopPropagation()
  }

  render () {
    const { value, onKeyDown } = this.props
    if (value && value[0] === '=') { return this.renderTextArea() }
    //if (value && value[0] === '/') { return this.renderList() }
    return (
      <input
        ref={input => { this._input = input }}
        className='data-editor'
        value={value}
        onKeyDown={onKeyDown}
        onChange={this.handleChange}
      />
    )
  }
}
