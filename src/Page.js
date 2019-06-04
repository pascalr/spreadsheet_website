import React from 'react'
import _ from 'lodash'
import avec from './avec'
import uuidv1 from 'uuid/v1'

// A Page is a list of Item.
// An Item can be a Page.

const PAGE_STYLE = {
  textAlign: 'center',
  width: '100%',
}

// FIXME: Escape pageName .
function addItem(pageName, set) {
  const id = uuidv1()
  set(pageName,{items: [id]})
}

class Page extends React.Component {
  constructor(props) {
    super(props)
  }

  renderItems = () => {
    return 'has items'
  }

  render = () => {
    console.log('rerender Page')
    const name = decodeURI(this.props.id)
    const that = _.get(this.props, name)
    return (<div style={PAGE_STYLE}>
      <h1>{name}</h1>
      {that && that.items ? this.renderItems() : 'The page \''+name+'\' is currently empty.'}
      <br/><br/>
      <div><button onClick={() => addItem(name, this.props.set)}>Add item</button></div>
    </div>);
  }
}

const AvecPage = props => {
  console.log('rerender AvecPage')
  const name = decodeURI(props.id)
  const Component = avec(name, Page)
  return <Component {...props}/>
}

export default AvecPage
