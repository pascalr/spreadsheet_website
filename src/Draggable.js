import React, {useState} from 'react'
import { connect } from "react-redux"
import {DraggableCore} from 'react-draggable'

const dragLinkProps = (state) => ({
  db: state.db
})

// TODO: Specify scale: number to draggable. See https://github.com/mzabriskie/react-draggable
const Draggable = connect(dragLinkProps)((props) => {
  const [isDragging, setIsDragging] = useState(false)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [dragX, setDragX] = useState(0)
  const [dragY, setDragY] = useState(0)
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
      onDrag={(e,data) => {
        setDragX(e.pageX)
        setDragY(e.pageY)
      }}
      onStart={(e, data) => {
        setIsDragging(true)
        setOffsetX(data.x)
        setOffsetY(data.y)
      }}
      disabled={props.disabled}
    >

      <div className='draggingDiv'>
        {isDragging ? null
            /*<div style={{
              width: 100, 
              height: 100, 
              left: dragX, 
              top: dragY, 
              backgroundColor: 'whitesmoke'}}>
            </div>*/
          : props.children
        }
        </div>
      </DraggableCore>
    );
})

export default Draggable
