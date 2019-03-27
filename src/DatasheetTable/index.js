import React, { Component } from 'react'
import ReactDataSheet from 'react-datasheet';
import _ from 'lodash'

import { DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Select from 'react-select'

import Command from '../Command'

import { Menu, MenuProvider, Item, Separator, Submenu } from 'react-contexify'

import { MenuSheetRenderer, RowRenderer, CellRenderer } from './DatasheetTable'

import { connect } from "react-redux";

import { set } from '../actions'

import * as TABLE from '../constants/tables'

const mapStateToProps = state => ({
  db: state.db,
})

const mapDispatchToProps = (dispatch) => ({
  set: path => val => dispatch(set(path,val)),
});

const onClickMenu = ({ event, props }) => console.log(event,props);

class DatasheetTable extends Component {
  
  renderSheet = (props) => (
    <MenuSheetRenderer def={this.props.def} {...props} />
  )
  
  generateGrid = (def) => {
    let colIds = def.layout[0];
    let rawGrid = (this.props.table || []).filter(e => e ? 1 : 0).map((row, j) => (
                              colIds.map(col => ({value: row[col]}) )
                        ))
    let emptyLine = new Array(colIds.length).fill({value: ""})
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
      return this.cols()[this.props.def.layout[0][col-1]]
    } else {
      return this.cols()[this.props.def.layout[0][col]]
    }
  }

  cols = () => ((this.props.def || {}).cols)

  valueFromCell = (cell,i,j) => {
    let cols = this.cols()
    if (this.cols() && !cell.readOnly) {
      let col = this.column(j);
      if (col && col.type) {
        if (col.type === "link" && cell.value) {
          return (<a href={cell.value}>{cell.value}</a>);
        } else if (col.type === "bullet") {
          return (<span>&bull;</span>)
        } else if (col.type === "checkbox") {
          debugger
          return (<input type="checkbox" defaultChecked={cell.value} onChange={() => {
            const path = [TABLE.TABLES,this.props.def.id,i,col.name]
            const val = cell.value ? !cell.value : 1;
            this.props.db.setPath(path, val, this.props.set(path))
          }}/>)
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
          onCellsChanged={this.props.onCellsChanged}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DatasheetTable);
