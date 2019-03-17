import React from 'react'

import { colDragSource, colDropTarget } from './drag-drop.js'

import { MenuProvider } from 'react-contexify'

import TableMenu from '../Table/TableMenu'

const onClickMenu = ({ event, props }) => console.log(event,props);

const Header = colDropTarget(colDragSource((props) => {
  const { tableDef, col, connectDragSource, connectDropTarget, isOver} = props
  const className = 'rTableHead cell read-only' + (isOver ? 'drop-target' : '')
  return (
    connectDropTarget(
      connectDragSource(
          <div className={className} style={{ width: col.width }}>
            {col.name}
          </div>
      )))
}))

class MenuSheetRenderer extends React.Component {
  render = () => (
    <React.Fragment>
      <MenuProvider id="tableMenu" data={{test: 1}} className="tableMenu">
        <SheetRenderer {...this.props}/>
      </MenuProvider>
      <TableMenu {...this.props} />
    </React.Fragment>
  );
}

class SheetRenderer extends React.PureComponent {
  render () {
    const { className, def } = this.props
    return (
      <div className={"rTable "+className}
           style={{backgroundColor: this.props.def.backgroundColor}}>
        <div className="rCaption">
          {def.name}
        </div>
        <div className="rTableHeading">
          <div className="rTableRow">
            <div className='rTableHead cell read-only row-handle' key='$$actionCell' />
            {
              def.columns.map((col, index) => (
                <Header key={col.name} col={col} def={def} className="data-header"
                  columnIndex={index} onColumnDrop={onClickMenu}
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

export { SheetRenderer, RowRenderer, CellRenderer, MenuSheetRenderer }
