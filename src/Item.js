import React from 'react'
import _ from 'lodash'
import avec from './avec'
//import Autocomplete from 'react-autocomplete'
//import { COMMANDS } from '../Command'

// A Page is a list of Item.
// An Item can be a Page.

const ITEM_STYLE = {
}

class Item extends React.Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
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

  render (props) {
    return (<div onKeyDown={this.onKeyDown}>
      <textarea {...props}
        value={'foo' || this.props.value.slice(1)}
        ref={input => { this._input = input }}
        onChange={(e) => {this.props.onChange('='+e.target.value)}}
        onKeyDown={this.textAreaKeyDown}
        style={{width: '100%'}}
      />
    </div>)
  }
}

export default Item
