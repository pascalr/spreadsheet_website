import React from "react"
import { connect } from "react-redux"
import * as TABLE from '../constants/tables'
import * as PATH from '../constants/paths'
import DatasheetTable from '../DatasheetTable'

import { RIEInput } from 'riek'
import { set, setDb } from '../actions'
import _ from 'lodash'

const mapStateToProps = state => ({
  db: state.db,
  defs: state.defs,
  dataRoot: state.cache.root[TABLE.TABLES],
});

const mapDispatchToProps = dispatch => ({
  set: path => val => dispatch(set(path,val)),
  setDb: (db, path, val) => dispatch(setDb(db, path,val)),
})

class Table extends React.Component {

  componentDidMount = () => {
    this.props.db.loadRecord(TABLE.TABLES,this.props.id,this.props.set([TABLE.TABLES, this.props.id]))
  }

  componentDidUpdate = () => {
    // FIXME: This is a quick fix, but I need to think about how to do this correctly
    /*if (this.def() && !this.data()) {
      console.log('badly updating table not found')
      this.props.db.loadRecord(TABLE.TABLES,this.props.id,
        (val) => this.props.set([TABLE.TABLES, this.props.id])(val || 'loaded'))
    }*/
  }

  def = () => this.props.defs[this.props.id];
  data = () => this.props.dataRoot ? this.props.dataRoot[this.props.id] : null;
  
  onCellsChanged = (layoutNb) => (changes, additions) => {
    let data = this.data() ? {...this.data()} : {}
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
    this.props.db.setRecord(TABLE.TABLES,this.props.id,data)
    this.setState({data})
  }

  onDeleteLines = (layoutNb, start, end) => {
    let data = this.data()
    const def = this.def()

    const colIds = def.layout[layoutNb];
    const mTable = colIds.reduce((nTable, colId) => {
      nTable[colId] = [...data[colId].slice(0,start), ...data[colId].slice(end+1)]
      return nTable
    },{})

    this.props.db.setRecord(TABLE.TABLES,this.props.id,{...data, ...mTable})
    this.setState({data})
  }

  renderDatasheetTable = () => {
    const def = this.props.defs[this.props.id];
    return def.layout.map((e,i) => {
      let isField = false
      // show a field
      const cols = def.layout[i]
      // If no columns side by side and only one value, show as a field
      if (cols.length === 1 && this.data()) {
        const rows = this.data()[cols[0]]
        if (rows.length === 1) {
          isField = true
        }
      }
      return (
        <DatasheetTable
          key={'DatasheetTable'+def.id+i}
          def={def}
          table={this.data()}
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
    this.props.db.setAttr(TABLE.DEFS,this.props.id,'name',props.title,
      this.props.set([TABLE.DEFS,this.props.id,'name'], props.title));
  }
  
  onIconChange = (props) => {
    this.props.db.setAttr(TABLE.DEFS,this.props.id,'icon',props.icon,
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

export default connect(mapStateToProps, mapDispatchToProps)(Table);
