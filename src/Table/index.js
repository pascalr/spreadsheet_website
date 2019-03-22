import React from "react"
import { connect } from "react-redux"
import * as TABLE from '../constants/tables'
import DatasheetTable from '../DatasheetTable'
import FixedDataTable from '../FixedDataTable'

import { RIEToggle, RIEInput, RIETextArea, RIENumber, RIETags, RIESelect } from 'riek'
import * as TABLES from '../constants/tables'
import { set } from '../actions'
import _ from 'lodash'

const mapStateToProps = state => ({
  db: state.db,
  defs: state.defs,
  dataRoot: state.cache.root[TABLE.TABLES],
});

const mapDispatchToProps = dispatch => ({
  set: path => val => dispatch(set(path,val))
})

class Table extends React.Component {

  componentDidMount = () => {
    this.props.db.loadRecord(TABLE.TABLES,this.name(),this.props.set([TABLE.TABLES, this.name()]))
  }

  name = () => this.props.params.id;
  def = () => this.props.defs[this.name()];
  data = () => this.props.dataRoot[this.name()];
  
  onCellsChanged = (changes, additions) => {
    let data = [...this.data()]
    const def = this.def()
    changes.concat(additions || []).forEach(({cell, row, col, value}) => {
      let rowVal = {...data[row]}
      if (!rowVal) {
        let empty = def.columns.reduce((acc,currVal) => {acc[currVal.name] = ""; return acc}, {})
        data[row] = empty
        rowVal = empty
      }
      if (def.showLineNumbers != false) {
        rowVal[def.columns[col-1].name] = value
      } else {
        rowVal[def.columns[col].name] = value
      }
      data[row] = rowVal;
    })
    this.props.db.setRecord(TABLE.TABLES,this.name(),data)
    this.setState({data})
  }

  renderDatasheetTable = () => {
    return (
        <DatasheetTable
          def={this.props.defs[this.name()]}
          table={this.data()}
          onCellsChanged={this.onCellsChanged}
        />);
  }

  updateDef = (newName) => {
    let def = null;
    if (this.data()[0]) {
      def = {columns: Object.keys(this.data()[0]).map(c => (
        {name: c}
      ))}
    } else {
      def = {columns: []}
    }
    this.props.db.setRecord(TABLE.DEFS,newName,def)
    this.props.db.deleteRecord(TABLE.DEFS,this.name(),def)
  }

  onTitleChange = (props) => {
    //console.log(JSON.stringify(props))
    this.props.db.setRecord(TABLE.TABLES,props.title,this.data(), (error) => {
      if (error) {
        // The write failed...
      } else {
        this.updateDef(props.title)
        this.props.db.deleteRecord(TABLE.TABLES,this.name())
      }
    })
    return null
  }

  render() {
    if (!this.props.dataRoot || !this.data() || !this.def()) {return null;}
    return (
      <div className="Table">
        <h1>
          <RIEInput
            value={this.name()}
            change={this.onTitleChange}
            propName='title'
            validate={_.isString} />
        </h1>
        {this.renderDatasheetTable()}
      </div>
    );
  }

  renderFixedDataTable = () => (
    <FixedDataTable {...this.props} data={this.data()} def={this.def()}/>);

}

export default connect(mapStateToProps, mapDispatchToProps)(Table);
