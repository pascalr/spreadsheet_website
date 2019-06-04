import React from 'react'
import _ from 'lodash'
import {MOUSE_ACTION,MOUSE_ACTION_DRAG,SELECTION, ROUTE, PREVIEWS,
  MOUSE_ACTION_COLOR,
  MOUSE_ACTION_ADD, MOUSE_ACTION_RESIZE,avec} from './contexts'
import colorable from './colorable'
import avec2 from './avec'

import { IoIosMove } from "react-icons/io";

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
    props.set('route', `/`)
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
      props.set('route', `/tables/${tableId}`)
    }
  }
  function enableColorBrush() {
    props.cache(MOUSE_ACTION, MOUSE_ACTION_COLOR)
  }

  const style = {...(props.style || {})}
  return (
    //<div style={{float:'right', width: '26px'}}>
      <div className='leftTooltip' style={style}>
        <div className='appRow'>
          {tooltipButton(<MdHome/>,redirectHome)}
          {tooltipButton(<IoIosMove/>,enableDrag)}
          {tooltipButton(<MdPhotoSizeSelectSmall/>,enableResize)}
          {tooltipButton(<MdAdd/>,enableAdd)}
          {tooltipButton(<MdRemoveRedEye/>,openSelection)}
          {tooltipButton(<MdColorLens/>,enableColorBrush)}
        </div>
      </div>
  )
})

export default colorable('Tooltip',avec2(null, RightTooltip))
