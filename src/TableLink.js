import React, { useState } from 'react'
import _ from 'lodash'
import { newTable } from "./actions"
import Link from './Link'
import { connect } from "react-redux"
import Table from './Table'

const HiddenTable = (props) => {
  const [hidden, setHidden] = useState(true)
  return (
    <React.Fragment>
      <span onClick={() => setHidden(!hidden)}>{hidden ? '+ ' : '- '}</span>
      <Link to={'/tables/'+props.id}>{props.name}</Link>
      {hidden ? null : <Table {...props} hideTableName={true}/>}
    </React.Fragment>
  )
}

const tableLinkProps = (state) => ({
  db: state.db,
  defs: state.defs,
})
const tableLinkDispatch = (dispatch) => ({
  newTable: (db, defs, name) => () => dispatch(newTable(db,defs,name)),
})

const TableLink = connect(tableLinkProps,tableLinkDispatch)((props) => {
  if (props.defs == null) { return null }
  const defId = props.id || _.keys(props.defs).find(e => props.defs[e].name === props.name)
  if (defId) {
    //return <Link to={'/tables/'+defId}>{props.defs[defId].name}</Link>
    return <HiddenTable id={defId} name={props.name}/>
  } else {
    return 'no table matches'
  }
})

export default TableLink
