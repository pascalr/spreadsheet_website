import React, { PureComponent } from 'react'
import Autocomplete from 'react-autocomplete'

export default class DataEditor extends PureComponent {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount () {
    this._input.focus()
  }

  handleChange (e) {
    this.props.onChange(e.target.value)
  }

  renderAutocomplete = () => {
    return <span>autocomplete</span>
  }

  render () {
    const {value, onKeyDown} = this.props
    if (value && value[0] === '=') { return this.renderAutocomplete() }
    return (
      <input
        ref={input => { this._input = input }}
        className='data-editor'
        value={value}
        onChange={this.handleChange}
        onKeyDown={onKeyDown}
      />
    )
  }
}

