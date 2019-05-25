import React from 'react'
import _ from 'lodash'

import {
  MdAdd,
  MdDragHandle,
  MdHistory,
  MdPinDrop,
} from 'react-icons/md';

// avec(SELECTION,
const Tooltip = (props) => {
  return (
    <div style={{
      borderStyle: 'solid',
      borderWidth: '2px',
      borderColor: 'black',
      backgroundColor: '#C0C0C0',
      position: 'absolute',
      left: props.x + 20,
      top: props.y - 20,}}
    >
      <div> <MdDragHandle onClick={() => console.log('clicked!')}/>Selection name<MdPinDrop/> </div>
      <div> 4Arrow <MdAdd/><MdHistory/></div>
    </div>
  )
}

export default Tooltip
