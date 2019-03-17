import React, { Component } from 'react'
import ReactDataSheet from 'react-datasheet';

import { DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Select from 'react-select'

import Command from '../Command'

import { Menu, MenuProvider, Item, Separator, Submenu } from 'react-contexify'

import { MenuSheetRenderer, RowRenderer, CellRenderer } from './DatasheetTable'

const onClickMenu = ({ event, props }) => console.log(event,props);

class DatasheetTable extends Component {
  
  renderSheet = (props) => (
    <MenuSheetRenderer def={this.props.def} {...props} />
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
    if (this.props.def.showLineNumbers != false) {
      return this.columns()[col-1]
    } else {
      return this.columns()[col]
    }
  }

  columns = () => ((this.props.def || {})["columns"])

  valueFromCell = (cell,i,j) => {
    let cols = this.columns()
    if (cols && !cell.readOnly) {
      let col = this.column(j);
      if (col && col.type) {
        if (col.type === "link" && cell.value) {
          return (<a href={cell.value}>{cell.value}</a>);
        } else if (col.type === "bullet") {
          return (<span>&bull;</span>)
        } else if (col.type === "checkbox") {
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
  
  render() {
    return (
      <div>
        <ReactDataSheet
          data={this.generateGrid(this.props.def)}
          sheetRenderer={this.renderSheet}
          rowRenderer={RowRenderer}
          cellRenderer={CellRenderer}
          valueRenderer={this.valueFromCell}
          dataRenderer={(cell) => cell.expr}
          onCellsChanged={onClickMenu}
        />
      </div>
    );
  }
}

export default DatasheetTable;
