import React, { Component } from 'react';

import ReactDataSheet from 'react-datasheet';
import 'react-datasheet/lib/react-datasheet.css';

import { withFirebase } from '../Firebase';

class DatasheetTableBase extends Component {
  constructor(props) {
    super(props)
    this.onCellsChanged = this.onCellsChanged.bind(this);
    this.addRow = this.addRow.bind(this);
    let grid = null;
    if (props.grid == null) {
      grid = [[{value: ""}]];
    } else {
      grid = props.grid;
      // Add numbers to each line
      /*for (let i = 0; i < grid.length; i++) {
        if (grid[i] != undefined) {
          grid[i].unshift({readOnly: true, value: i+1})
        }
      }
      // Add letters to each column, if there is more than one
      let n_column = grid[1].length - 1;
      if (n_column > 1) {
        let letters = [{readOnly: true, value: ""}]
        for (let i = 0; i < n_column; i++) {
          letters.push({readOnly: true, value: String.fromCharCode(65 + i)})
        }
        grid.unshift(letters)
      }*/
    }
    this.state = {
      name: props.name,
      background_color: props.background_color || "white",
      grid: grid
    }
  }

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
    console.log('onCellsChanged')
    const grid = this.state.grid.map(row => [...row])
    changes.forEach(({cell, row, col, value}) => {
      grid[row][col] = {...grid[row][col], value}
    })
    this.setState({grid})
  }

  addRow() {
    const grid = this.state.grid.slice();
    grid.push([{readOnly: true, value: grid.length+1},{value: ""}])
    this.setState({
      name: this.state.name,
      background_color: this.state.background_color,
      grid: grid
    })
  }

  render() {
    return (
      <div className="table" style={{backgroundColor: this.state.background_color}}>
        <div className="titlebar">
          <span></span>
          <span className="table_name">
            {this.state.name}
          </span>
          <span className="add_button">
            <button className="add" onClick={this.addRow}>
              Add
            </button>
          </span>
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
