import React from 'react'
import _ from 'lodash'
import avec from './avec'

// A Page is a list of Item.
// An Item can be a Page.

const ITEM_STYLE = {
}

class Item extends React.Component {
  constructor(props) {
    super(props)
  }
  render = () => {
    return 'item'
  }
}

export default Item
