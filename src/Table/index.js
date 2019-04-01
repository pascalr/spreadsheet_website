import React from "react"
import { connect } from "react-redux"
import * as TABLE from '../constants/tables'
import DatasheetTable from '../DatasheetTable'
import FixedDataTable from '../FixedDataTable'

import { RIEInput, RIETextArea } from 'riek'
import { set } from '../actions'
import _ from 'lodash'
import Emoji from '../Emoji'

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
    this.props.db.loadRecord(TABLE.TABLES,this.id,this.props.set([TABLE.TABLES, this.id]))
  }

  id = this.props.params.id;
  def = () => this.props.defs[this.id];
  data = () => this.props.dataRoot ? this.props.dataRoot[this.id] : null;
  
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
      if (def.showLineNumbers != false) {
        rowVal[def.layout[0][col-1]] = value
      } else {
        rowVal[def.layout[0][col]] = value
      }
      data[row] = rowVal;
    })
    this.props.db.setRecord(TABLE.TABLES,this.id,data)
    this.setState({data})
  }

  renderDatasheetTable = () => {
    return (
        <DatasheetTable
          def={this.def()}
          table={this.data()}
          onCellsChanged={this.onCellsChanged}
        />);
  }

  onTitleChange = (props) => {
    this.props.db.setAttr(TABLE.DEFS,this.id,'name',props.title,
      this.props.set([TABLE.DEFS,this.id,'name'], props.title));
  }
  
  onIconChange = (props) => {
    this.props.db.setAttr(TABLE.DEFS,this.id,'icon',props.icon,
      this.props.set([TABLE.DEFS,this.id,'icon'], props.icon));
  }

  render() {
    //if (!this.props.dataRoot || !this.data() || !this.def()) {return null;}
    if (!this.def()) {return null;}
    return (
      <div className="Table">
        <h1>
          <RIEInput
            value={<Emoji symbol={this.def().icon || "📁"}/>}
            change={this.onIconChange}
            propName='icon'
            validate={_.isString} />
          <RIEInput
            value={this.def().name}
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
