import React, {useState} from 'react'
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
               onDrag={() => setLinkDisabled(true)}
               defaultPosition={{x: x0, y: y0}}>
      <div>
        {linkDisabled ?
          <span className="linkDesc">{props.desc}</span>
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
