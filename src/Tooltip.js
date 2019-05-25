import React from 'react'
import _ from 'lodash'
import {MOUSE_ACTION,MOUSE_ACTION_DRAG,withDispatch} from './contexts'

import {
  MdDragHandle,
  MdPhotoSizeSelectSmall,
} from 'react-icons/md';

function tooltipButton(draw, callback) {
  return <span className="tooltipButton" onClick={callback}>{draw}</span>
}

const RightTooltip = withDispatch((props) => {
  
  function enableDrag() {
    props.cache(MOUSE_ACTION, MOUSE_ACTION_DRAG)
  }

  return (
    <div style={{float:'right', width: '26px'}}>
      <div className='rightTooltip'>
      <div className='appRow'>
        {tooltipButton(<MdDragHandle/>,enableDrag)}
        {tooltipButton(<MdPhotoSizeSelectSmall/>,() => {return null})}
      </div>
      </div>
    </div>
  )
})

// avec(SELECTION,
  /*const Tooltip = withDispatch((props) => {

  

  //const tableRow = [] ....
  return (
    <div style={{
      zIndex: '1000',
      borderStyle: 'solid',
      borderWidth: '2px',
      borderColor: 'black',
      backgroundColor: '#C0C0C0',
      position: 'absolute',
      left: props.x + 20,
      top: props.y - 20,}}
    >
      <div className='appRow'>
        {tooltipButton(<MdDragHandle/>,enableDrag)}
        {tooltipButton(<MdClose/>,() => {return null})}
      </div>
      <div className='prewviewRow'> <MdViewColumn/>4Arrow Selection name<MdAdd/><MdHistory/></div>
    </div>
  )
})*/

export default RightTooltip
