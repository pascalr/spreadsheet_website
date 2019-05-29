import React from 'react'
import _ from 'lodash'
import {avec, MOUSE_ACTION, SELECTED_COLOR,
  MOUSE_ACTION_COLOR, withDispatch} from './contexts'
import colorable from './colorable'

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
  style.height = '100%'
  style.position = 'absolute'
  style.width = '200px'
  return <div style={style}>
    <div style={{textAlign: 'center', fontWeight: 'bold'}}>Color menu</div>
    <div style={{borderBottom: '2px solid black', display: 'flex', flexWrap: 'wrap',
    borderTop: '2px solid black'}}>
      <ColorBox color='maroon'/>
      <ColorBox color='red'/>
      <ColorBox color='orange'/>
      <ColorBox color='yellow'/>
      <ColorBox color='olive'/>
      <ColorBox color='green'/>
      <ColorBox color='purple'/>
      <ColorBox color='fuchsia'/>
      <ColorBox color='lime'/>
      <ColorBox color='teal'/>
      <ColorBox color='aqua'/>
      <ColorBox color='blue'/>
      <ColorBox color='navy'/>
      <ColorBox color='black'/>
      <ColorBox color='gray'/>
      <ColorBox color='silver'/>
      <ColorBox color='white'/>
      <ColorBox color='whitesmoke'/>
      <ColorBox color='gold'/>
      <ColorBox color='tomato'/>
    </div>
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
