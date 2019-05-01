import React, { Component } from 'react'
import ReactDataSheet from 'react-datasheet';
import _ from 'lodash'

import { MenuSheetRenderer, RowRenderer, CellRenderer } from './DatasheetTable'
import DataEditor from './DataEditor'

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
    let colIds = def.layout[this.props.layoutNb];
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
    return this.cols()[this.props.def.layout[this.props.layoutNb][col-1]]
  }

  cols = () => ((this.props.def || {}).cols)

  valueFromCell = (cell,i,j) => {
    let value = undefined
    let style = undefined
    if (j === 0 && this.props.hideLineNumbers) {return <span></span>}
    if (this.cols() && !cell.readOnly) {
      let col = this.column(j);
      if (col.type === "document") {
        style = {textAlign: 'justify',paddingLeft: '15%',paddingRight: '15%'}
      }
      if (cell.value && cell.value[0] === '=') { // = should be pure
        try {
          window.context = {
            table: this.props.table,
            def: this.props.def,
            i, j,
          }
          const result = eval.call(window, cell.value.slice(1)); // FIXME: In onCellsChanged, eval there, set type to "function"
          if (typeof result === 'object' && result !== null) {
            //return JSON.stringify(result)
            value = result
          } else if (result === true) {
            value = 'true'
          } else if (result === false) {
            value = 'false'
          } else if (result === undefined) {
            value = 'undefined'
          } else {
            value = result
          }
        } catch(error) {
				  value = error.toString();
        }
      } else if (cell.value && cell.value[0] === ':') { // : has side effects
          value = (<button onClick={() => {
            eval.call(window, cell.value.slice(1))
            this.setState({reload: !this.state.reload})
          }}>
            {cell.value.slice(1)}
          </button>)
      } else {
        if (col && col.type) {
          if (col.type === "link" && cell.value) {
            value = (<a href={cell.value}>{cell.value}</a>);
          } else if (col.type === "bullet") {
            value = (<span>&bull;</span>)
          } else if (col.type === "checkbox") {
            value = (<input type="checkbox" defaultChecked={cell.value} onChange={() => {
              const path = [TABLE.TABLES,this.props.def.id,i,col.name]
              const val = cell.value ? !cell.value : 1;
              this.props.db.setPath(path, val, this.props.set(path))
            }}/>)
          } else {
            value = cell.value
          }
        }
      }
    }
    return <div style={style}>{value ? value : cell.value}</div>
  }

  dataRenderer = (def) => (cell,i,j) => {
    return cell.value;
    let colIds = def.layout[this.props.layoutNb];
    let val = (this.props.table || []).filter(e => e && e === colIds[j] ? 1 : 0)[i]
    return val;
  }

  cellRenderer = (props) => {
    return <CellRenderer {...props} hideLineNumbers={this.props.hideLineNumbers}/>
  }

  dataEditor = (props) => {
    return <DataEditor {...props}/>
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
          dataEditor={this.dataEditor}
          onCellsChanged={this.props.onCellsChanged}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DatasheetTable);
