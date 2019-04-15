import React, {useState} from 'react'
import _ from 'lodash'
import { connect } from "react-redux"
import ReactDraggable from 'react-draggable'
import {DraggableCore} from 'react-draggable'

const dragLinkProps = (state) => ({
  db: state.db
})

// TODO: Specify scale: number to draggable. See https://github.com/mzabriskie/react-draggable
const Draggable = connect(dragLinkProps)((props) => {
  const [isDragging, setIsDragging] = useState(false)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  return (
    <DraggableCore
      onStop={(e, data) => {
        const deltaX = data.x - offsetX;
        const deltaY = data.y - offsetY;
        props.db.update(props.path, {x: props.x+deltaX, y: props.y+deltaY})
        setIsDragging(false)
      }}
      handle='.dragHandle'
      grid={[5,5]}
      onStart={(e, data) => {
        setIsDragging(true)
        setOffsetX(data.x)
        setOffsetY(data.y)
      }}
      disabled={props.disabled}
    >

      <div className='draggingDiv'>
        {isDragging ? null : props.children }
        </div>
      </DraggableCore>
    );
})

export default Draggable
