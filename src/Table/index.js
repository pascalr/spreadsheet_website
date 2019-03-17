import React from "react"
import { connect } from "react-redux"
import * as TABLE from '../constants/tables'
import DatasheetTable from '../DatasheetTable'

class ObjectElement extends React.Component {
  render() {
    return (
      <div>
        {Object.keys(this.props.val).map((k) => {
          return this.props.val[k];
        })}
      </div>
    );
  }
}

class ArrayElement extends React.Component {
  render() {
    return (
      <div>
        <ObjectElement val={this.props.val}/>
      </div>
    );
  }
}

const onClickMenu = ({ event, props }) => console.log(event,props);

const mapStateToProps = state => ({
  db: state.db,
  defs: state.defs,
});

class Table extends React.Component {

  constructor(props) {
    super(props)
    this.props.db.loadRecord(TABLE.TABLES,this.name, (table) => {
      this.setState({data: table})
    })
    this.state = {}
  }

  name = this.props.match.params.id

  render() {
    if (!this.state.data) {return null;}
    return (
      <div className="Table">
        <h1>{this.name}</h1>
        <DatasheetTable
          tableDef={this.props.defs[this.name]}
          table={this.state.data}
          doAddColumn={onClickMenu}
          doDeleteTable={onClickMenu}
          doDeleteColumn={onClickMenu}
          onCellsChanged={onClickMenu}
          onColumnDrop={onClickMenu}
        />
      </div>
    );
  }

    /*render() {
    return (
      <div className="Table">
        <h1>{this.name}</h1>
        <div className="TableArray">
          {this.state.data ?
            this.state.data.map(d => (<ArrayElement val={d}/>))
          : null}
        </div>
      </div>
    );
  }*/
}

export default connect(mapStateToProps)(Table);
