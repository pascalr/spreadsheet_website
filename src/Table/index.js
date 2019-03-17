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
    this.props.db.loadRecord(TABLE.TABLES,this.name(), (table) => {
      this.setState({data: table})
    })
    this.state = {}
  }

  name = () => this.props.match.params.id;
  def = () => this.props.defs[this.name()];

  renderDatasheetTable = () => (
        <DatasheetTable
          tableDef={this.props.defs[this.name()]}
          table={this.state.data}
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
