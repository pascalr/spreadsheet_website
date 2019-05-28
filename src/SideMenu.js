import React from 'react'
import _ from 'lodash'
import {avec, MOUSE_ACTION, BACKGROUND_COLOR, SELECTED_COLOR,
MOUSE_ACTION_COLOR, withDispatch} from './contexts'

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

const ColorBox = withDispatch(props => {
  const style = {width: '20px', height:'20px'}
  style.backgroundColor = props.color
  style.cursor = 'pointer'
  return <div style={style} onClick={(e) => {
    props.cache(SELECTED_COLOR, props.color)
    e.stopPropagation()
    e.preventDefault()
  }}/>
})

const ColorSideMenu = colorable('sideMenu', function ColorableSideMenu(props) {
  const style={...(props.style || {})}
  style.border = 'solid 3px black'
  return <div style={style}>
    <ColorBox color='red'/>
    <ColorBox color='green'/>
    <ColorBox color='blue'/>
  </div>
})

const PositionedSideMenu = props => {
  let menu = null
  if (_.get(props, MOUSE_ACTION) === MOUSE_ACTION_COLOR) {
    menu = <ColorSideMenu {...props}/>
  }
  if (!menu) {return null}
  return <div className='leftSideMenu'>
    {menu}
  </div>
}

export default avec(MOUSE_ACTION,PositionedSideMenu)
