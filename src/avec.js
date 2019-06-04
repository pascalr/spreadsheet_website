import React from 'react'
import _ from 'lodash'
import { connect } from "react-redux"
import * as ACTION from "./constants/action-types"

function set(path, val) {
  path = _.castArray(path)
  // When everything will use this method, I can deprecate the use of root.
  return { type: ACTION.CACHE.SET, path: ['root', ...path], val };
}

const mapDispatchToProps = (dispatch) => ({
  set: (path, val) => dispatch(set(path,val))
  //unset(path) => dispatch(un
})

const avec = (attrs, Comp) => {
  attrs = _.castArray(attrs)
  const map = (state) => (attrs.reduce((acc, curr) => {
    acc[curr] = _.get(state.cache.root, curr)
    return acc
  }, {}))
  return connect(map, mapDispatchToProps)(Comp)
}

export default avec
