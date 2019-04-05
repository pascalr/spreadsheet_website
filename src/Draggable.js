import React, {useState} from 'react'
import _ from 'lodash'
import { connect } from "react-redux"
import ReactDraggable from 'react-draggable'

const dragLinkProps = (state) => ({
  db: state.db
})

const handleDrop = (db, path, setIsDragging) => (e, data) => {
  db.update(path, {x: data.x, y: data.y})
  setIsDragging(false)
}

// TODO: Specify scale: number to draggable. See https://github.com/mzabriskie/react-draggable
const Draggable = connect(dragLinkProps)((props) => {
  const [isDragging, setIsDragging] = useState(false)
  return (
    <ReactDraggable onStop={handleDrop(props.db, props.path, setIsDragging)}
               grid={[5,5]}
               onDrag={() => setIsDragging(true)}
               defaultPosition={{x: props.x0, y: props.y0}}
               disabled={props.disabled}
             >
      <div>
        {isDragging ?
          <span className="linkDesc">dragging</span>
            :
            props.children
        }
        </div>
      </ReactDraggable>
    );
})

export default Draggable
