import React from 'react'
import _ from 'lodash'
import avec from './avec'
import {MOUSE_ACTION, BACKGROUND_COLOR, SELECTED_COLOR,
MOUSE_ACTION_COLOR} from './consts'

const colorable = (id, Comp) => avec([SELECTED_COLOR, MOUSE_ACTION,
  BACKGROUND_COLOR+'.'+id], function Colorable(props) {

  const path = BACKGROUND_COLOR+'.'+id
  const backgroundColor = _.get(props, path)
  const selectedColor = _.get(props, SELECTED_COLOR)
  let style = {}
  return (
    <div style={style} onClick={() => {
      if (_.get(props, MOUSE_ACTION) === MOUSE_ACTION_COLOR) {
        //props.dispatch(path, 'red')
        props.dispatch(path, selectedColor)
      }
    }}>
      <Comp {...props} style={{backgroundColor: backgroundColor}}/>
    </div>
  )
})

export default colorable
