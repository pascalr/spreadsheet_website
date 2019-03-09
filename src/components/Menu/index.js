import React, { Component } from 'react'

import { Menu, Item, Separator, Submenu, MenuProvider } from 'react-contexify'
import 'react-contexify/dist/ReactContexify.min.css';

const withMenu = (menu, val) => {
  return (
  <React.Fragment>
    <MenuProvider id={menu.props.id}>
      {val}
    </MenuProvider>
    {menu}
  </React.Fragment>
  )
}

export {withMenu};
