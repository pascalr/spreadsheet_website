import React from 'react'
import _ from 'lodash'
import { connect } from "react-redux"
import * as ACTION from "./constants/action-types"

// implicitly forwarding arguments
//    onReceiveImpressions: (...impressions) =>
//      dispatch(trackImpressions(impressions))
//  }

function set(path, val) {
  path = _.castArray(path)
  // When everything will use this method, I can deprecate the use of root.
  return { type: ACTION.CACHE.SET, path: ['root', ...path], val };
}

function persist(db, path, val) {
  db.set(path,val)
  path = _.castArray(path)
  // When everything will use this method, I can deprecate the use of root.
  return { type: ACTION.CACHE.SET, path: ['root', ...path], val };
}

const mapDispatchToProps = (dispatch, props) => ({
  set: (path, val) => dispatch(set(path,val)),
  dispatchPersist: (db) => (path, val) => dispatch(persist(db, path,val)),
  //unset(path) => dispatch(un
})

//const mergeProps = (propsFromState, propsFromDispatch, ownProps) => ({
//  persist: propsFromDispatch.dispatchPersist(propsFromState.db)
//})

const mergeProps = (propsFromState, propsFromDispatch, ownProps) => {
  return {
    ...propsFromState,
    ...propsFromDispatch,
    ...ownProps,
    persist: propsFromDispatch.dispatchPersist(propsFromState.db),
  };
};

export const connectFor = (Comp, attrs) => {
  const names = _.keys(attrs)
  const map = (state) => (_.merge({db: state.db}, (names.reduce((acc, curr) => {
    _.set(acc, curr, _.get(state.cache.root, attrs[curr]))
    return acc
  }, {}))))
  return connect(map, mapDispatchToProps, mergeProps)(Comp)
}

export const withUpToDate = () => {
}

// TODO: avec([path],[path],...Comp)
const avec = (attrs, Comp) => {
  attrs = _.castArray(attrs)
  const map = (state) => (_.merge({db: state.db}, attrs.reduce((acc, curr) => {
    _.set(acc, curr, _.get(state.cache.root, curr))
    return acc
  }, {})))
  return connect(map, mapDispatchToProps, mergeProps)(Comp)
}

export default avec
