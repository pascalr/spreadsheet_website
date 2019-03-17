import React from "react"
import { connect } from "react-redux"
import * as TABLE from '../constants/tables'

const mapStateToProps = state => ({
  db: state.db,
  defs: state.defs,
});

class Table extends React.Component {

  name = this.props.match.params.id

  constructor(props) {
    super(props)
    this.props.db.loadRecord(TABLE.TABLES,this.name, (table) => {
      this.setState({data: table})
    })
  }

  render() {
    return (
      <h2>Show a table:</h2>
    );
  }
}

export default connect(mapStateToProps)(Table);
