import React from "react"
import { connect } from "react-redux"
import * as TABLE from '../constants/tables'
import DatasheetTable from '../DatasheetTable'
import FixedDataTable from '../FixedDataTable'

const mapStateToProps = state => ({
  db: state.db,
  defs: state.defs,
});

class Table extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount = () => {
    this.props.db.loadRecord(TABLE.TABLES,this.name(), (table) => {
      this.setState({data: table})
    })
  }

  name = () => this.props.match.params.id;
  def = () => this.props.defs[this.name()];
  
  onCellsChanged = (changes, additions) => {
    let data = [...this.state.data]
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
    debugger
    this.props.db.setRecord(TABLE.TABLES,this.name(),data)
    this.setState({data})
  }

  renderDatasheetTable = () => (
        <DatasheetTable
          def={this.props.defs[this.name()]}
          table={this.state.data}
          onCellsChanged={this.onCellsChanged}
        />);

  render() {
    if (!this.state.data) {return null;}
    return (
      <div className="Table">
        <h1>{this.name()}</h1>
        {this.renderDatasheetTable()}
      </div>
    );
  }

  renderFixedDataTable = () => (
    <FixedDataTable {...this.props} data={this.state.data} def={this.def()}/>);

}

export default connect(mapStateToProps)(Table);
