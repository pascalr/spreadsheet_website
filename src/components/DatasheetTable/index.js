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

  columns = () => {
    let table_def = this.state.table_defs[this.state.name]
    if (table_def) {
      return table_def["columns"]
    } else {
      return undefined
    }
  }
  
  onCellsChanged(changes) {
    const grid = this.state.grid.map(row => [...row])
    changes.forEach(({cell, row, col, value}) => {
      let val = {}
      for (let i = 0; i < this.columns().length; i++) {
        val[this.columns()[i].name] = grid[row][i+1].value || ""
      }
      val[this.columns()[col-1].name] = value;
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

  customValueRenderer = (cell,i,j) => {
    // if cell.bold = true, encadrer avec <strong></strong>
    // ouin, mais ca serait mieux de pouvoir mettre en gras une partie du texte seulement
    // essayer avec LaTeX
    let cols = this.columns()
    if (cols && i > 0 && j > 0) { // FIXME: This will break when I make numbers optional
      let col = cols[j-1];
      if (col && col.type && col.type == "link" && cell.value) {
        return (<a href={cell.value}>{cell.value}</a>);
      }
    }
    return cell.value;
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
          valueRenderer={this.customValueRenderer}
          dataRenderer={(cell) => cell.expr}
          onCellsChanged={this.onCellsChanged}
        />
      </div>
    );
  }
}

const DatasheetTable = withFirebase(DatasheetTableBase);

export default DatasheetTable;
