import React, {useRef} from 'react'
import _ from 'lodash'
import {avec, MOUSE_ACTION, SIDE_MENU, BACKGROUND_COLOR, MOUSE_ACTION_COLOR} from './contexts'

const colorable = (id, Comp) => avec([MOUSE_ACTION, BACKGROUND_COLOR+'.'+id], props => {

  const compRef = useRef(null);
  const path = BACKGROUND_COLOR+'.'+id
  const backgroundColor = _.get(props, path)
  let style = {}
  if (backgroundColor) {
    style.backgroundColor = backgroundColor
    if (compRef && compRef.style) {
      compRef.style.background = 'red'
    }
  }
  console.log('hhhehhehehehhehe!!!!!!!!!!!!')
  return (
    <span style={style} onClick={() => {
      if (_.get(props, MOUSE_ACTION) === MOUSE_ACTION_COLOR) {
        props.dispatch(path, 'red')
      }
    }}>
      <Comp {...props} ref={compRef} style={{backgroundColor: 'red'}}/>
    </span>
  )
})

const SideMenu = props => {
  const menuName = _.get(props, SIDE_MENU)
  if (!menuName) {return null}
  return (
    <div style={{...(props.style || {})}} className='leftSideMenu'>
      <div style={{textAlign: 'center'}}>{menuName}</div>
    </div>
  );
}

export default avec(SIDE_MENU, colorable('sideMenu', SideMenu))
