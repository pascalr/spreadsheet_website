import React, {useState} from 'react'
import _ from 'lodash'
import { connect } from "react-redux"
import Draggable from 'react-draggable'
import * as TABLE from './constants/tables'
import LinkItem from './LinkItem'
import Link from './Link'
import { newTable } from "./actions";

const handleDrop = (db, id, oldVals, setLinkDisabled) => (e, data) => {
  const copy = {...oldVals}
  copy.x = data.x
  copy.y = data.y
  db.setPath([TABLE.ITEMS, id], copy)
  setLinkDisabled(false)
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
  const defId = _.keys(props.defs).find(e => props.defs[e].name === props.name)
  if (defId) {
    return <Link to={'tables/'+defId}>{props.defs[defId].name}</Link>
  } else {
    if (props.name) {
      newTable(props.db,props.defs,props.name)
      return 'creating table...'
    } else {
      return 'invalid table name'
    }
  }
})

const cmd_table = (args) => {
  return <TableLink name={args[0]}/>
}
const cmd_a = (args) => {
  return <a href={args[0]}>{args.length > 1 ? args[1] : args[0]}</a>
}

//const parseCmd = (str) => {
const Command = ({cmd}) => {
  if (!cmd) { return <span className='error'>empty cmd</span>}
  if (cmd.charAt(0) === '=') {
    const sub = cmd.slice(1)
    //const r = /^[a-zA-Z]*/;
    //const cmdName = r.exec(sub)
    const vals = sub.split(',')
    const cmdName = vals[0]
    if (cmdName === 'a') {
      return cmd_a(vals.splice(1))
    } else if (cmdName === 'table') {
      return cmd_table(vals.splice(1))
    } else {
      return <span className='error'>unkown command</span>
    }
  } else {
    return <span>{cmd}</span>
  }
}

export default Command
