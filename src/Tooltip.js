import React from 'react'
import _ from 'lodash'
import {MOUSE_ACTION,MOUSE_ACTION_DRAG,SELECTION, ROUTE, PREVIEWS,
  MOUSE_ACTION_COLOR,
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
  function enableColorBrush() {
    props.cache(MOUSE_ACTION, MOUSE_ACTION_COLOR)
  }

  return (
    //<div style={{float:'right', width: '26px'}}>
      <div className='leftTooltip'>
        <div className='appRow'>
          {tooltipButton(<MdHome/>,redirectHome)}
          {tooltipButton(<MdDragHandle/>,enableDrag)}
          {tooltipButton(<MdPhotoSizeSelectSmall/>,enableResize)}
          {tooltipButton(<MdAdd/>,enableAdd)}
          {tooltipButton(<MdRemoveRedEye/>,openSelection)}
          {tooltipButton(<MdColorLens/>,enableColorBrush)}
        </div>
      </div>
  )
})

export default RightTooltip
