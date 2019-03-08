import React, { Component } from 'react'
import ReactDataSheet from 'react-datasheet';

import { withFirebase } from '../Firebase';

// TODO: Garder les valeurs pas dans grid
// puis faire setState{tables: ...}

class DatasheetTableBase extends Component {
  constructor(props) {
    super(props)
    this.state = {
      grid: this.generateGrid(this.props.tableDef)
    }
  }
  
  generateGrid = (def) => {
    let columns = def["columns"] || []
    let firstLine = null;
    let dataLines = null;
    if (def.showLineNumbers != false) {
      firstLine = [{readOnly: true, value:""}, // top left corner is blank
                       ...columns.map((col, j) => (
                            {readOnly: true, value: col.name}
                       ))];
      dataLines = (this.props.table || []).map((table, j) => (
                            [{readOnly: true, value:j},
                              ...columns.map(col => ({value: table[col.name]}) )
                            ]
                        ))
    } else {
      firstLine = columns.map((col, j) => (
                            {readOnly: true, value: col.name}
                       ))
      dataLines = (this.props.table || []).map((table, j) => (
                              columns.map(col => ({value: table[col.name]}) )
                        ))
    }
    let grid = [firstLine, ...dataLines].filter((el) => ( el != null ));
    let emptyLine = new Array(def.columns.length + (def.showLineNumbers ? 1 : 0)).fill({value: ""})
    if (def.showLineNumbers != false) {
      emptyLine[0] = {readOnly: true, value: grid.length}
    }
    return [...grid, emptyLine]
  }

  column = (col) => {
    if (this.props.tableDef.showLineNumbers != false) {
      return this.columns()[col-1]
    } else {
      return this.columns()[col]
    }
  }

  columns = () => ((this.props.tableDef || {})["columns"])
  
  customValueRenderer = (cell,i,j) => {
    // if cell.bold = true, encadrer avec <strong></strong>
    // ouin, mais ca serait mieux de pouvoir mettre en gras une partie du texte seulement
    // essayer avec LaTeX
    let cols = this.columns()
    if (cols && !cell.readOnly) {
      let col = this.column(j);
      if (col && col.type) {
        if (col.type == "link" && cell.value) {
          return (<a href={cell.value}>{cell.value}</a>);
        } else if (col.type == "bullet") {
          return (<span>&bull;</span>)
        }
      }
    }
    return cell.value;
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
