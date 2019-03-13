import React, { Component } from 'react'
import ReactDataSheet from 'react-datasheet';

import { DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Select from 'react-select'

import Command from '../Command'

import { Menu, MenuProvider, Item, Separator, Submenu } from 'react-contexify'

import { SheetRenderer, RowRenderer, CellRenderer } from './DatasheetTable'

const onClickMenu = ({ event, props }) => console.log(event,props);

class DatasheetTableBase extends Component {
  constructor(props) {
    super(props)
    this.state = {
      grid: this.generateGrid(this.props.tableDef)
    }
  }
  
  renderSheet = (props) => ( // FIXME: {...props}
    <SheetRenderer tableDef={this.props.tableDef} columns={this.props.tableDef.columns} onColumnDrop={this.props.onColumnDrop(this.props.tableDef)} columnMenuItems={this.columnMenuItems} {...props} />
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
      return (this.props.tableDef.name+i, this.rowMenuItems(),
                       this.valueFromCell(cell,i,j))
    
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

  render() {
    return (
        <div>
        <ReactDataSheet
          data={this.generateGrid(this.props.tableDef)}
          sheetRenderer={this.renderSheet}
          rowRenderer={this.renderRow}
          cellRenderer={this.renderCell}
          valueRenderer={this.customValueRenderer}
          dataRenderer={(cell) => cell.expr}
          onCellsChanged={this.props.onCellsChanged(this.props.tableDef)}
        /></div>
      )
  }
}

const DatasheetTable = DatasheetTableBase;

export default DatasheetTable;
