import React from 'react'
import _ from 'lodash'
import avec, {connectFor} from './avec'
import uuidv1 from 'uuid/v1'
import Item from './Item'

// A Page is a list of Item.
// An Item can be a Page.

const PAGE_STYLE = {
  textAlign: 'center',
  marginLeft: '20%',
  marginRight: '20%',
  width: '60%',
}

function addItem(pageName, set) {
  const id = uuidv1()
  set(['pages',pageName],{items: [id]})
}

class Page extends React.Component {
  renderItems = () => {
    return this.props.items.map(item => <Item id={item}/>)
  }

  render = () => {
    const {id, items} = this.props
    console.log('rerender Page')
    const name = decodeURI(id)
    return (<div style={PAGE_STYLE}>
      <h1>{name}</h1>
      {items ? this.renderItems() : 'The page \''+name+'\' is currently empty.'}
      <br/><br/>
      <div><button onClick={() => addItem(name, this.props.set)}>Add item</button></div>
      <h2>Pages with similar names:</h2>
    </div>);
  }
}

const AvecPage = props => {
  console.log('rerender AvecPage')
  const name = decodeURI(props.id)
  const Component = connectFor(Page, {items: ['pages',name,'items']})
  return <Component {...props}/>
}

export default AvecPage
