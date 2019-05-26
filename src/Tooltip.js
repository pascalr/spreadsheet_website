import React from 'react'
import _ from 'lodash'
import {MOUSE_ACTION,MOUSE_ACTION_DRAG,SELECTION, ROUTE, PREVIEWS,
  MOUSE_ACTION_ADD, MOUSE_ACTION_RESIZE,avec} from './contexts'

import {
  MdDragHandle,
  MdPhotoSizeSelectSmall,
  MdAdd,
  MdRemoveRedEye,
  MdHome,
  MdColorLens,
} from 'react-icons/md';

function tooltipButton(draw, callback) {
  return <span className="tooltipButton" onClick={callback}>{draw}</span>
}

const RightTooltip = avec([SELECTION,PREVIEWS], (props) => {

  function redirectHome() {
    props.cache(ROUTE, `/`)
  }
  function enableDrag() {
    props.cache(MOUSE_ACTION, MOUSE_ACTION_DRAG)
  }
  function enableResize() {
    props.cache(MOUSE_ACTION, MOUSE_ACTION_RESIZE)
  }
  function enableAdd() {
    props.cache(MOUSE_ACTION, MOUSE_ACTION_ADD)
  }
  function openSelection() {
    const ids = _.get(props, SELECTION)
    if (ids.length === 1) {
      const tableId = props.previews[ids[0]].tableId
      props.cache(ROUTE, `/tables/${tableId}`)
    }
  }

  return (
    //<div style={{float:'right', width: '26px'}}>
    <div style={{float:'left', width: '26px'}}>
      <div className='leftTooltip'>
        <div className='appRow'>
          {tooltipButton(<MdHome/>,redirectHome)}
          {tooltipButton(<MdDragHandle/>,enableDrag)}
          {tooltipButton(<MdPhotoSizeSelectSmall/>,enableResize)}
          {tooltipButton(<MdAdd/>,enableAdd)}
          {tooltipButton(<MdRemoveRedEye/>,openSelection)}
          {tooltipButton(<MdColorLens/>,() => {})}
        </div>
      </div>
    </div>
  )
})

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
