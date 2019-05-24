import React from "react"
import { connect } from "react-redux"
import * as TABLE from '../constants/tables'
import * as PATH from '../constants/paths'
import DatasheetTable from '../DatasheetTable'

import { RIEInput } from 'riek'
import { set, setDb } from '../actions'
import _ from 'lodash'
import Loading from '../Loading'
import {avec, TABLES} from '../contexts'

const mapStateToProps = state => ({
  db: state.db,
  defs: state.defs,
});

const mapDispatchToProps = dispatch => ({
  set: path => val => dispatch(set(path,val)),
  setDb: (db, path, val) => dispatch(setDb(db, path,val)),
})

class Table extends React.Component {

  def = () => this.props.defs[this.props.id];
  
  onCellsChanged = (layoutNb) => (changes, additions) => {
    //let data = this.data() ? {...this.data()} : {}
    let data = this.props.tables ? this.props.tables[this.props.id] : {}
    if (data === "") {data = {}}
    //let data = this.props.data || {}
    const def = this.def()
    changes.concat(additions || []).forEach(({cell, row, col, value, type}) => {

      // ugly temporary fix to separate a cell
      if (cell && cell.value.slice(0,2) === '==' && !value) { return } 

      let colId = def.layout[layoutNb][col-1]
      const dataCol = [...(data[colId] || [])]
      dataCol[row] = value || ''
      data[colId] = dataCol
    })
    console.log('onCellsChanged')
    console.log(data)
    this.props.db.set([TABLE.TABLES,this.props.id],data)
    this.props.dispatch([TABLE.TABLES,this.props.id],data)
    this.setState({data})
  }

  onDeleteLines = (layoutNb, start, end) => {
    //let data = this.props.data
    let data = this.props.tables ? this.props.tables[this.props.id] : {}
    if (data === "") {data = {}}
    const def = this.def()

    const colIds = def.layout[layoutNb];
    const mTable = colIds.reduce((nTable, colId) => {
      nTable[colId] = [...data[colId].slice(0,start), ...data[colId].slice(end+1)]
      return nTable
    },{})

    this.props.db.set([TABLE.TABLES,this.props.id],{...data, ...mTable})
    this.setState({data})
  }

  renderDatasheetTable = () => {
    if (!this.props.tables) {return null}
    const def = this.props.defs[this.props.id];
    return def.layout.map((e,i) => {
      let isField = false
      // show a field
      const cols = def.layout[i]
      // If no columns side by side and only one value, show as a field
      if (cols.length === 1 && this.props.tables && this.props.tables[this.props.id]) {
        const rows = this.props.tables[cols[0]]
        if (rows && rows.length === 1) {
          isField = true
        }
      }
      return (
        <DatasheetTable
          key={'DatasheetTable'+def.id+i}
          def={def}
          table={this.props.tables[this.props.id]}
          onCellsChanged={this.onCellsChanged(i)}
          onDeleteLines={this.onDeleteLines}
          hideLineNumbers={this.props.hideLineNumbers}
          isField={isField}
          layoutNb={i}
          {...this.props}
        />);
    })
  }

  onTitleChange = (props) => {
    this.props.db.set([TABLE.DEFS,this.props.id,'name'],props.title,
      this.props.set([TABLE.DEFS,this.props.id,'name'], props.title));
  }
  
  onIconChange = (props) => {
    this.props.db.set([TABLE.DEFS,this.props.id,'icon'],props.icon,
      this.props.set([TABLE.DEFS,this.props.id,'icon'], props.icon));
  }

  onMouseDown = (e) => {
    // Does not work but the idea is good I think
    // It actually works, but not in the correct order...
    console.log('table on mouse down')
    //e.preventDefault()
    //e.stopPropagation(); // In order to only click in the inner most table
  }

  render() {
    if (!this.def()) {console.log('no def yet'); return null;}
    return (
      <div className="Table" onMouseDown={this.onMouseDown}>
        { this.props.hideTableName ? null :
          <div style={{textAlign: 'center'}}>
          <span className='title'>
            <RIEInput
              value={this.def().name}
              change={this.onTitleChange}
              propName='title'
              validate={_.isString} />
          </span>
          <span onClick={() => {
            // TODO: Add a comment that says the table has been moved
            // to trash and will be deleted in a certain period of time permanently.
            // Offers to delete it permanently right now.
            this.props.setDb(this.props.db, [TABLE.DEFS, this.props.id, 'del'],'1')
            this.props.set(PATH.ROUTE)('/')
          }}
          className='link'>🗑</span>
        </div>}
        {this.renderDatasheetTable()}
        { this.props.hideTableName ? null : 'Add field'}
      </div>
    );
  }

}

const AvecTable = (props) => {
  const Component = avec(TABLES+'.'+props.id, Table)
  return <Component {...props}/>
}

const LoadingTable = (props) => {
  return <Loading path={[TABLE.TABLES,props.id]}>
    <Table {...props} data={props.dataRoot ? props.dataRoot[props.id] : null}/>
  </Loading>
}

export default connect(mapStateToProps, mapDispatchToProps)(AvecTable);
//export default connect(mapStateToProps, mapDispatchToProps)(LoadingTable);
