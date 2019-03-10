import React, { Component } from 'react'
import ReactDataSheet from 'react-datasheet';

import { withFirebase } from '../Firebase';

import { DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Select from 'react-select'

import Command from '../Command'

import {
  colDragSource, colDropTarget,
  rowDragSource, rowDropTarget
} from './drag-drop.js'

import { Menu, MenuProvider, Item, Separator, Submenu } from 'react-contexify'
import { withMenu } from '../Menu'

const columnMenuItems = () => (
  <React.Fragment>
    <Item onClick={onClickMenu}>delete column</Item>
    <Separator />
    <Item onClick={onClickMenu}>rename</Item>
    <Separator />
    <Submenu label="Foobar">
      <Item onClick={onClickMenu}>Foo</Item>
      <Item onClick={onClickMenu}>Bar</Item>
    </Submenu>
  </React.Fragment>
);

const rowMenuItems = () => (
  <React.Fragment>
    <Item onClick={onClickMenu}>delete row</Item>
    <Separator />
    <Item onClick={onClickMenu}>add row</Item>
    <Separator />
    <Submenu label="Foobar">
      <Item onClick={onClickMenu}>Foo</Item>
      <Item onClick={onClickMenu}>Bar</Item>
    </Submenu>
  </React.Fragment>
);

const onClickMenu = ({ event, props }) => console.log(event,props);

const Header = colDropTarget(colDragSource((props) => {
  const { tableDef, col, connectDragSource, connectDropTarget, isOver } = props
  const className = 'rTableHead cell read-only' + (isOver ? 'drop-target' : '')
  return (columnMenuItems(),
    connectDropTarget(
      connectDragSource(
          <div className={className} style={{ width: col.width }}>
            {withMenu(tableDef.name + col.name,columnMenuItems(),col.name)}
          </div>
      )))
}))

class SheetRenderer extends React.PureComponent {
  render () {
    const { className, columns, onColumnDrop, tableDef } = this.props
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
                        columnIndex={index} onColumnDrop={onColumnDrop} />
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

class DatasheetTableBase extends Component {
  constructor(props) {
    super(props)
    this.state = {
      grid: this.generateGrid(this.props.tableDef)
    }
  }
  
  renderSheet = (props) => ( // FIXME: {...props}
    <SheetRenderer tableDef={this.props.tableDef} columns={this.props.tableDef.columns} onColumnDrop={this.props.onColumnDrop(this.props.tableDef)} {...props} />
  )
  
  generateGrid = (def) => {
    let columns = def.columns || []
    let rawGrid = (this.props.table || []).slice(0,20).map((row, j) => (
                              columns.map(col => ({value: row[col.name]}) )
                        ))
    let emptyLine = new Array(def.columns.length).fill({value: ""})
    let grid = []
    for (var i = 0; i < rawGrid.length; ++i) {
       grid.push(rawGrid[i] ? rawGrid[i] : emptyLine)
    }
    grid.push(emptyLine)
    if (def.showLineNumbers != false) {
      grid = grid.map((l,j) => [{readOnly: true, value:j+1}, ...l])
    }
    return grid
  }

  column = (col) => {
    if (this.props.tableDef.showLineNumbers != false) {
      return this.columns()[col-1]
    } else {
      return this.columns()[col]
    }
  }

  columns = () => ((this.props.tableDef || {})["columns"])

  valueFromCell = (cell,i,j) => {
    let cols = this.columns()
    if (cols && !cell.readOnly) {
      let col = this.column(j);
      if (col && col.type) {
        if (col.type == "link" && cell.value) {
          return (<a href={cell.value}>{cell.value}</a>);
        } else if (col.type == "bullet") {
          return (<span>&bull;</span>)
        } else if (col.type == "checkbox") {
          //return (<input type="checkbox">)
        }
      }
      if (cell.value && cell.value[0] === '=') { // Command
        let cmd = cell.value.substr(1)
        try {
          return Command[cmd]() // TODO: A lot...
        } catch {
          return <span style={{color: 'red'}}>#Erreur!</span>
        }
      }
    }
    return cell.value;
  }
  
  customValueRenderer = (cell,i,j) => {
    if (j == 0 && this.props.tableDef) {
      return (withMenu(this.props.tableDef.name+i, rowMenuItems(),
                       this.valueFromCell(cell,i,j)))
    
    } else {
      return this.valueFromCell(cell,i,j)
    }
  }

  renderCell (props) {
    return <CellRenderer {...props} />
  }

  renderRow (props) {
    const {row, cells, ...rest} = props
    return <RowRenderer rowIndex={row} className="data-row" {...rest} />
  }

  tableMenuItems = () => (
    <React.Fragment>
      <Item onClick={() => this.props.doDeleteTable(this.props.tableDef)}>delete table</Item>
      <Separator />
      <Item onClick={() => this.props.doAddColumn(this.props.tableDef)}>add column</Item>
      <Separator />
      <Submenu label="Foobar">
        <Item onClick={onClickMenu}>Foo</Item>
        <Item onClick={onClickMenu}>Bar</Item>
      </Submenu>
    </React.Fragment>
  );

  render() {
    return (
      withMenu(this.props.tableDef.name, this.tableMenuItems(),
        <ReactDataSheet
          data={this.generateGrid(this.props.tableDef)}
          sheetRenderer={this.renderSheet}
          rowRenderer={this.renderRow}
          cellRenderer={this.renderCell}
          valueRenderer={this.customValueRenderer}
          dataRenderer={(cell) => cell.expr}
          onCellsChanged={(changes) => (this.props.onCellsChanged(changes, this.props.tableDef))}
        />, "table"
      )
    );
  }
}

const DatasheetTable = withFirebase(DatasheetTableBase);

export default DatasheetTable;
