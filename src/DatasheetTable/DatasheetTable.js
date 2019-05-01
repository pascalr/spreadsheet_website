import React from 'react'

import { MenuProvider } from 'react-contexify'

import SheetRenderer from './SheetRenderer'

class MenuSheetRenderer extends React.Component {
  render = () => {console.log(`layoutNb=${this.props.layoutNb}`); return (
    <React.Fragment>
      <MenuProvider id="tableMenu" data={{def: this.props.def, layoutNb: this.props.layoutNb}} className="tableMenu">
        <SheetRenderer {...this.props}/>
      </MenuProvider>
    </React.Fragment>
  )};
}

const RowRenderer = (props) => {
  return (
    <div className={"rTableRow " + props.className}>
      { props.children }
    </div>
  )
}

const CellRenderer = props => {
  const {cell, row, col, columns, attributesRenderer, hideLineNumbers,
    selected, editing, updated, style, ...rest } = props

  // hey, how about some custom attributes on our cell?
  const attributes = cell.attributes || {}
  // ignore default style handed to us by the component and roll our own
  //attributes.style = { width: columns[col].width }
  //if (col === 0) {
  //  attributes.title = cell.label
  //}
  if (hideLineNumbers && col === 0) {
    return null
  }
  return (
      <div {...rest} {...attributes}>
        {props.children}
      </div>
  )
}

export { SheetRenderer, RowRenderer, CellRenderer, MenuSheetRenderer }
