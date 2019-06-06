import React from 'react'
import _ from 'lodash'
import avec, {connectFor} from './avec'
//import Autocomplete from 'react-autocomplete'
//import { COMMANDS } from '../Command'

// A Page is a list of Item.
// An Item can be a Page.

const ITEM_STYLE = {
}

class Item extends React.Component {

  componentDidMount() {
    console.log('fetching item')
    this.props.fetch(['items',this.props.id,'value'])
  }

  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.renderTextArea = this.renderTextArea.bind(this)
    this.state = {value: props.value || ''}
  }

  handleChange (e) {
    this.setState({value: e.target.value})
    this.props.persist(['items',this.props.id,'value'],e.target.value)
  }

  textAreaKeyDown = (e) => {
    console.log(e)
    if (e.keyCode === 8 || e.keyCode === 46) {// backspace or delete
      if (this.props.value.length <= 1) {
        this.props.onChange(e.target.value)
      }
    }
  }

  // Must be in a different function than render.
  // see https://github.com/erikras/redux-form/issues/1853
  renderTextArea = () => {
    return (<div onKeyDown={this.onKeyDown} key={"div_textarea_item_"+this.props.id}>
      <textarea
        key={"textarea_item_"+this.props.id}
        value={this.state.value || '• Empty'}
        ref={input => { this._input = input }}
        onChange={this.handleChange}
        onKeyDown={this.textAreaKeyDown}
        style={{width: '100%'}}
      />
    </div>)
  }

  render () {
    console.log('Rendering item')
    return <div key={'div'+this.props.id}>{this.renderTextArea()}</div>
  }

  componentWillUnmount() {
    console.log('unmounting item')
  }
}

const AvecItem = props => {
  const Component = connectFor(Item, {value: ['items',props.id,'value']})
  return <Component {...props}/>
}

export default AvecItem
