import React, { Component } from 'react';

import ReactDataSheet from 'react-datasheet';
import 'react-datasheet/lib/react-datasheet.css';

import { withFirebase } from '../Firebase';

class DatasheetTableBase extends Component {
  constructor(props) {
    super(props)
    this.onCellsChanged = this.onCellsChanged.bind(this);
    this.addRow = this.addRow.bind(this);
    this.state = {
      name: props.name,
      background_color: props.background_color || "white",
      table_defs: props.table_defs,
      grid: props.grid || [[{value: ""}]],
    }
  }
  //letters.push({readOnly: true, value: String.fromCharCode(65 + i)})

  /*static getDerivedStateFromProps(props, current_state) {
    debugger
    if (current_state.grid !== props.grid) {
      return {
        grid: props.grid,
        //computed_prop: heavy_computation(props.value)
      }
    }
    return null
  }*/
  
  onCellsChanged(changes) {
    const grid = this.state.grid.map(row => [...row])
    changes.forEach(({cell, row, col, value}) => {
      let columns = this.state.table_defs[this.state.name]["columns"]
      let column = columns[col-1]
      console.log(`onCellsChanged: cell=${cell}, row=${row}, col=${col}, value=${value}`)
      console.log(`column = ${column}`)
      let val = {}
      for (let i = 0; i < columns.length; i++) {
        val[columns[i]] = grid[row][i+1].value
      }
      val[column] = value;
      this.props.firebase.tableRow(this.state.name,row).set(val)
      grid[row][col] = {...grid[row][col], value}
    })
    this.setState({grid})
  }

  addRow() {
    const grid = this.state.grid.slice();
    grid.push([{readOnly: true, value: grid.length+1},{value: ""}])
    this.setState({grid: grid})
  }

  render() {
    return (
      <div className="table" style={{backgroundColor: this.state.background_color}}>
        <div className="titlebar">
          <span className="add_button">
            <button className="add" onClick={this.addRow}>
              Add
            </button>
          </span>
          <span className="table_name">
            {this.state.name}
          </span>
          <span></span>
        </div>
        <ReactDataSheet
          data={this.state.grid}
          valueRenderer={(cell) => cell.value}
          dataRenderer={(cell) => cell.expr}
          onCellsChanged={this.onCellsChanged}
        />
      </div>
    );
  }
}

const DatasheetTable = withFirebase(DatasheetTableBase);

export default DatasheetTable;
