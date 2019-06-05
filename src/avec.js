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

export const connectFor = (Comp, attrs) => {
  const names = _.keys(attrs)
  const map = (state) => (names.reduce((acc, curr) => {
    _.set(acc, curr, _.get(state.cache.root, attrs[curr]))
    return acc
  }, {}))
  return connect(map, mapDispatchToProps)(Comp)
}

// TODO: avec([path],[path],...Comp)
const avec = (attrs, Comp) => {
  attrs = _.castArray(attrs)
  const map = (state) => (attrs.reduce((acc, curr) => {
    _.set(acc, curr, _.get(state.cache.root, curr))
    return acc
  }, {}))
  return connect(map, mapDispatchToProps)(Comp)
}

export default avec
