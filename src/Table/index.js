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

  def = () => this.props.defs[this.props.id];
  data = () => this.props.dataRoot ? this.props.dataRoot[this.props.id] : null;
  
  onCellsChanged = (layoutNb) => (changes, additions) => {
    let data = this.data() ? {...this.data()} : {}
    const def = this.def()
    changes.concat(additions || []).forEach(({cell, row, col, value}) => {

      let colId = def.layout[layoutNb][col-1]
      const dataCol = [...(data[colId] || [])]
      dataCol[row] = value
      data[colId] = dataCol
    })
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

    this.props.db.setRecord(TABLE.TABLES,this.props.id,mTable)
    this.setState({data})
  }

  renderDatasheetTable = () => {
    const def = this.props.defs[this.props.id];
    return def.layout.map((e,i) => {
      return (
        <DatasheetTable
          key={'DatasheetTable'+i}
          def={def}
          table={this.data()}
          onCellsChanged={this.onCellsChanged(i)}
          onDeleteLines={this.onDeleteLines}
          hideLineNumbers={this.props.hideLineNumbers}
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

  render() {
    //if (!this.props.dataRoot || !this.data() || !this.def()) {return null;}
    if (!this.def()) {console.log('no def yet'); return null;}
    return (
      <div className="Table">
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
      </div>
    );
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Table);
