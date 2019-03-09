import React, { Component } from 'react'

import { Menu, Item, Separator, Submenu, MenuProvider } from 'react-contexify'
import 'react-contexify/dist/ReactContexify.min.css';

const InlineMenu = (props) => (
  <React.Fragment>
    <MenuProvider id={props.id} className={props.className}>
      {props.children}
    </MenuProvider>
    <Menu id = {props.id}>
      {props.items}
    </Menu>
  </React.Fragment>
)

const withMenu = (id, items, val, className) => {
  return (
  <React.Fragment>
    <MenuProvider id={id} className={className}>
        {val}
    </MenuProvider>
    <Menu id = {id}>
      {items}
    </Menu>
  </React.Fragment>
  )
}

export {InlineMenu, withMenu};
