import React from 'react'

import { colDragSource, colDropTarget } from './drag-drop.js'
import { withMenu } from '../Menu'

const Header = colDropTarget(colDragSource((props) => {
  const { tableDef, col, connectDragSource, connectDropTarget, isOver,
          columnMenuItems} = props
  const className = 'rTableHead cell read-only' + (isOver ? 'drop-target' : '')
  return (columnMenuItems(col),
    connectDropTarget(
      connectDragSource(
          <div className={className} style={{ width: col.width }}>
            {withMenu(tableDef.name + col.name,columnMenuItems(col),col.name)}
          </div>
      )))
}))

class SheetRenderer extends React.PureComponent {
  render () {
    const { className, columns, onColumnDrop, tableDef, columnMenuItems } = this.props
    return (
      <div className={"rTable "+className}
           style={{backgroundColor: this.props.tableDef.backgroundColor}}>
        <div className="rCaption">
          {tableDef.name}
        </div>
        <div className="rTableHeading">
          <div className="rTableRow">
            <div className='rTableHead cell read-only row-handle' key='$$actionCell' />
            {
              columns.map((col, index) => (
                <Header key={col.name} col={col} tableDef={tableDef} className="data-header"
                  columnIndex={index} onColumnDrop={onColumnDrop}
                  columnMenuItems={columnMenuItems}
                />
              ))
            }
          </div>
        </div>
        <div className="rTableBody data-body">
          {this.props.children}
        </div>
      </div>
    )
  }
}

const RowRenderer = (props) => {
  return (
    <div className={"rTableRow " + props.className}>
      { props.children }
    </div>
  )
}

const CellRenderer = props => {
  const {cell, row, col, columns, attributesRenderer,
    selected, editing, updated, style, ...rest } = props

  // hey, how about some custom attributes on our cell?
  const attributes = cell.attributes || {}
  // ignore default style handed to us by the component and roll our own
  //attributes.style = { width: columns[col].width }
  //if (col === 0) {
  //  attributes.title = cell.label
  //}
  return (
      <div {...rest} {...attributes}>
        {props.children}
      </div>
  )
}

export { SheetRenderer, RowRenderer, CellRenderer }
