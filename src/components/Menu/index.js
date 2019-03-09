import React, { Component } from 'react'

import { Menu, Item, Separator, Submenu, MenuProvider } from 'react-contexify'
import 'react-contexify/dist/ReactContexify.min.css';

const withMenu = (id, items, val) => {
  return (
  <React.Fragment>
    <MenuProvider id={id}>
        {val}
    </MenuProvider>
    <Menu id = {id}>
      {items}
    </Menu>
  </React.Fragment>
  )
}

export {withMenu};
