import React from 'react'
import { connect } from "react-redux";

import Helper from '../Helper'

import * as TABLES from '../constants/tables'

const EMPTY_DEF = {backgroundColor: "", columns: {},showLineNumbers: true}

const mapStateToProps = state => ({
  db: state.db
})

// A DefinitionsProvider is the single source of truth of table definitions.
// I lifted the state up of definitions here.
class RawDefinitionsProvider extends React.Component {
  constructor(props) {
    super(props)
    
    //this.props.db.load(TABLES.DEFS, defs => (this.setState({defs: defs})))
    this.state = {}
  }

  newTable = ({ event, props }) => {
    const defs = {...this.state.defs}
    const name = Helper.nextTableName(defs)
    defs[name] = EMPTY_DEF
    this.props.db.set(TABLES.DEFS,defs)
    this.setState({defs: defs})
  }

  render = () => (
    <React.Fragment>
      {React.Children.map(this.props.children, child =>
        React.cloneElement(child, { defs: this.state.defs, defsHandler: this })
      )}
    </React.Fragment>
  )
}

const DefinitionsProvider = connect(mapStateToProps)(RawDefinitionsProvider);

export default DefinitionsProvider;
