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

import { Menu, Item, Separator, Submenu } from 'react-contexify'
import { withMenu } from '../Menu'

const MyAwesomeMenu = (props) => (
  <Menu id = {props.id}>
    <Item onClick={onClickMenu}>delete</Item>
    <Separator />
    <Item onClick={onClickMenu}>add line</Item>
    <Separator />
    <Submenu label="Foobar">
      <Item onClick={onClickMenu}>Foo</Item>
      <Item onClick={onClickMenu}>Bar</Item>
     </Submenu>
  </Menu>
);

const onClickMenu = ({ event, props }) => console.log(event,props);

// 1 = A, A..Z, AA..ZZ, AAA..ZZZ, etc
const Header = colDropTarget(colDragSource((props) => {
  const { col, connectDragSource, connectDropTarget, isOver } = props
  const className = isOver ? 'cell read-only drop-target' : 'cell read-only'
  return connectDropTarget(
    connectDragSource(
      <th className={className} style={{ width: col.width }}>{col.name}</th>
    ))
}))

class SheetRenderer extends React.PureComponent {
  render () {
    const { className, columns, onColumnDrop } = this.props
    return (
      <table className={className}>
        <thead>
          <tr>
            <th className='cell read-only row-handle' key='$$actionCell' />
            {
              columns.map((col, index) => (
                <Header key={col.name} col={col} columnIndex={index} onColumnDrop={onColumnDrop} />
              ))
            }
          </tr>
        </thead>
        <tbody>
          {this.props.children}
        </tbody>
      </table>
    )
  }
}

const RowRenderer = (props) => {
  return (
    <tr>
      { props.children }
    </tr>
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
    <SheetRenderer columns={this.props.tableDef.columns} onColumnDrop={this.props.onColumnDrop(this.props.tableDef)} {...props} />
  )
  
  generateGrid = (def) => {
    let columns = def.columns || []
    let rawGrid = (this.props.table || []).map((row, j) => (
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
      return (withMenu(<MyAwesomeMenu id={this.props.tableDef.name+i} />,
                       this.valueFromCell(cell,i,j)))
    
    } else {
      return this.valueFromCell(cell,i,j)
    }
  }

  renderRow (props) {
    const {row, cells, ...rest} = props
    return <RowRenderer rowIndex={row} {...rest} />
  }

  render() {
    return (
      <div className="table" style={{backgroundColor: this.props.tableDef.backgroundColor}}>
        <div className="titlebar">
          <span className="add_button">
            <button className="add" onClick={() => (
                      this.props.doAddRow(this.props.table,this.props.tableDef))}>
              Add row
            </button>
            <button className="add" onClick={() => (this.props.doAddColumn(this.props.tableDef))}>
              Add column
            </button>
          </span>
          <span className="table_name">
            {this.props.name}
          </span>
          <span></span>
        </div>
          <ReactDataSheet
            data={this.generateGrid(this.props.tableDef)}
            sheetRenderer={this.renderSheet}
            rowRenderer={this.renderRow}
            valueRenderer={this.customValueRenderer}
            dataRenderer={(cell) => cell.expr}
            onCellsChanged={(changes) => (this.props.onCellsChanged(changes, this.props.tableDef))}
          />
      </div>
    );
  }
}

const DatasheetTable = withFirebase(DatasheetTableBase);

export default DatasheetTable;
