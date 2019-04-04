import React, {useState} from 'react'
import _ from 'lodash'
import { connect } from "react-redux"
import Draggable from 'react-draggable'
import * as TABLE from './constants/tables'
import LinkItem from './LinkItem'
import Link from './Link'

const handleDrop = (db, id, oldVals, setLinkDisabled) => (e, data) => {
  const copy = {...oldVals}
  copy.x = data.x
  copy.y = data.y
  db.setPath([TABLE.SCREEN, id], copy)
  setLinkDisabled(false)
}

const tableLinkProps = (state) => ({
  db: state.db,
  defs: state.defs,
})

const TableLink = connect(tableLinkProps)((props) => {
  if (props.defs == null) { return null }
  console.log(`props.name = ${props.name}`)
  const defId = _.keys(props.defs).find(e => {console.log(`id = ${e}, name = ${props.defs[e].name}`); return (props.defs[e].name === props.name)})
  if (defId) {
    return <Link to={'tables/'+defId}>{props.defs[defId].name}</Link>
  } else {
    return 'table not found'
  }
})

const cmd_table = (args) => {
  return <TableLink name={args[0]}/>
}
const cmd_a = (args) => {
  return <a href={args[0]}>{args.length > 1 ? args[1] : args[0]}</a>
}

const parseCmd = (str) => {
  if (str.charAt(0) === '=') {
    const sub = str.slice(1)
    //const r = /^[a-zA-Z]*/;
    //const cmdName = r.exec(sub)
    const vals = sub.split(',')
    const cmdName = vals[0]
    if (cmdName === 'a') {
      return cmd_a(vals.splice(1))
    } else if (cmdName === 'table') {
      return cmd_table(vals.splice(1))
    }
  } else {
    return <span>{str}</span>
  }
}

const dragLinkProps = (state) => ({
  db: state.db
})

// TODO: Specify scale: number to draggable. See https://github.com/mzabriskie/react-draggable
const DraggableLink = connect(dragLinkProps)((props) => {
  const [linkDisabled, setLinkDisabled] = useState(false)
  const x0 = props.vals ? (props.vals.x || 0) : 0
  const y0 = props.vals ? (props.vals.y || 0) : 0
  return (
    <Draggable onStop={handleDrop(props.db, props.id, props.vals, setLinkDisabled)}
               grid={[5,5]}
               onDrag={() => setLinkDisabled(true)}
               defaultPosition={{x: x0, y: y0}}>
      <div>
        {linkDisabled ?
          <span className="linkDesc">{props.desc}</span>
            :
          props.cmd ?
            parseCmd(props.cmd)
          :

          props.linkRef ?
          <Link to={props.linkRef}>
            <span className="linkDesc">{props.desc}</span>
          </Link> :
          <span className="linkDesc">{props.desc}</span>
        }
        </div>
      </Draggable>
    );
})

export default DraggableLink
