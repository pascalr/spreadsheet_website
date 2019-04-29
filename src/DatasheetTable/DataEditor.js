import React, { PureComponent } from 'react'
import _ from 'lodash'
import Autocomplete from 'react-autocomplete'
import { COMMANDS } from '../Command'

export default class DataEditor extends PureComponent {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
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

  renderTextArea = (props) => {
  return <textarea {...props} />
  }

  renderAutocomplete = () => {
    return (
      <div onKeyDown={this.onKeyDown}>
      <Autocomplete
            getItemValue={(item) => item}
            items={_.keys(COMMANDS)}
            renderItem={(item, isHighlighted) => (
              <div style={{ background: isHighlighted ? 'lightgray' : 'white',
                            cursor: 'pointer'}}
                key={item}
              >
                {item}
              </div>
            )}
            ref={el => this._input = el}
            renderInput={this.renderTextArea}
            shouldItemRender={(item,str) => _.includes(item,str.slice(1))}
            value={this.props.value}
            onChange={this.handleChange}
            onSelect={(val, item) => this.props.onChange('='+item+'(')}
          /></div>)
  }
            //onSelect={(val, item) => this.props.set(PATH.ROUTE,item.value)}
  onKeyDown = (e) => {
    e.stopPropagation()
    console.log('on key down on data editor')
  }

  render () {
    const {value, onKeyDown} = this.props
    if (value && value[0] === '=') { return this.renderAutocomplete() }
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

