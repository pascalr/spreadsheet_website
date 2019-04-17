import React, { Component } from 'react'
import ReactDataSheet from 'react-datasheet';
import _ from 'lodash'

import { MenuSheetRenderer, RowRenderer, CellRenderer } from './DatasheetTable'

import { connect } from "react-redux";

import { set } from '../actions'

import * as TABLE from '../constants/tables'

const stringify = function(obj) {
	try {
		return JSON.stringify(obj);
	} catch(e) {
		return obj.toString();
	}
}
const mapStateToProps = state => ({
  db: state.db,
})

const mapDispatchToProps = (dispatch) => ({
  set: path => val => dispatch(set(path,val)),
});

class DatasheetTable extends Component {

  constructor(props) {
    super(props)
    this.state = {reload: false}
  }
  
  renderSheet = (props) => (
    <MenuSheetRenderer {...props} {...this.props} />
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
    // Add a column for line numbers
    grid = grid.map((l,j) => [{readOnly: true, value:j+1}, ...l])
    return grid
  }

  column = (col) => {
    return this.cols()[this.props.def.layout[0][col-1]]
  }

  cols = () => ((this.props.def || {}).cols)

  valueFromCell = (cell,i,j) => {
    if (j === 0 && this.props.hideLineNumbers) {return <span></span>}
    if (this.cols() && !cell.readOnly) {
      if (cell.value && cell.value[0] === '=') { // = should be pure
        try {
          window.context = {
            table: this.props.table,
            def: this.props.def,
          }
          const result = eval.call(window, cell.value.slice(1)); // FIXME: In onCellsChanged, eval there, set type to "function"
          return result
        } catch(error) {
				  return error.toString();
        }
      }
      if (cell.value && cell.value[0] === ':') { // : has side effects
        return (<button onClick={() => {
          eval.call(window, cell.value.slice(1))
          this.setState({reload: !this.state.reload})
        }}>
          {cell.value.slice(1)}
        </button>)
      }
      let col = this.column(j);
      if (col && col.type) {
        if (col.type === "link" && cell.value) {
          return (<a href={cell.value}>{cell.value}</a>);
        } else if (col.type === "bullet") {
          return (<span>&bull;</span>)
        } else if (col.type === "checkbox") {
          return (<input type="checkbox" defaultChecked={cell.value} onChange={() => {
            const path = [TABLE.TABLES,this.props.def.id,i,col.name]
            const val = cell.value ? !cell.value : 1;
            this.props.db.setPath(path, val, this.props.set(path))
          }}/>)
        }
      }
    }
    return cell.value;
  }

  dataRenderer = (def) => (cell,i,j) => {
    return cell.value;
    let colIds = def.layout[0];
    let val = (this.props.table || []).filter(e => e && e === colIds[j] ? 1 : 0)[i]
    return val;
  }

  cellRenderer = (props) => {
    return <CellRenderer {...props} hideLineNumbers={this.props.hideLineNumbers}/>
  }
  
  render() {
    return (
      <div>
        <ReactDataSheet
          data={this.generateGrid(this.props.def)}
          sheetRenderer={this.renderSheet}
          rowRenderer={RowRenderer}
          cellRenderer={this.cellRenderer}
          valueRenderer={this.valueFromCell}
          dataRenderer={this.dataRenderer(this.props.def)}
          onCellsChanged={this.props.onCellsChanged}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DatasheetTable);
