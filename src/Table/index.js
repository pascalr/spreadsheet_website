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
  
  onCellsChanged = (changes, additions) => {
    let data = this.data() ? [...this.data()] : [[]]
    const def = this.def()
    changes.concat(additions || []).forEach(({cell, row, col, value}) => {
      let rowVal = {...data[row]}
      if (!rowVal) {
        let empty = _.keys(def.cols).reduce((acc,currVal) => {acc[currVal.name] = ""; return acc}, {})
        data[row] = empty
        rowVal = empty
      }
      if (def.showLineNumbers !== false) {
        rowVal[def.layout[0][col-1]] = value
      } else {
        rowVal[def.layout[0][col]] = value
      }
      data[row] = rowVal;
    })
    this.props.db.setRecord(TABLE.TABLES,this.props.id,data)
    this.setState({data})
  }

  renderDatasheetTable = () => {
    return (
        <DatasheetTable
          def={this.def()}
          table={this.data()}
          onCellsChanged={this.onCellsChanged}
          hideLineNumbers={this.props.hideLineNumbers}
          {...this.props}
        />);
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
    console.log('rendering table')
    //if (!this.props.dataRoot || !this.data() || !this.def()) {return null;}
    if (!this.def()) {console.log('no def yet'); return null;}
    return (
      <div className="Table">
        { this.props.hideTableName ? null :
          <React.Fragment>
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
        </React.Fragment>}
        {this.renderDatasheetTable()}
      </div>
    );
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Table);
