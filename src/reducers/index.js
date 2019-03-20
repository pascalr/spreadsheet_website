import * as ACTION from "../constants/action-types";

import { combineReducers } from 'redux'

import Firebase from '../Firebase'

const uiInitialState = {
  editMode: false,
};

function ui(state = uiInitialState, action) {
  if (action.type === ACTION.TOGGLE_EDIT_MODE) {
    return Object.assign({}, state, {editMode:!state.editMode})
  }
  return state;
}

function updateNested(obj, path, val) {
  if (path.constructor === Array) {
    return {...obj, [path[0]]: path.length > 1 ? updateNested(obj, path.slice(1), val) : val}
  } else if (typeof path === 'string') {
    return {...obj, [path]: val}
  } else {
    throw new Error("Unsupported path type to set for a model.");
  }
}

// The cache is the local version of the db.
// It is a generic way of accessing models.
function cache(state = {}, action) {
  if (action.type === ACTION.CACHE.SET) {
    return updateNested(state, action.path, action.val)

  } else if (action.type === ACTION.CACHE.NEW) {
  } else if (action.type === ACTION.CACHE.LIST) {
  } else if (action.type === ACTION.CACHE.DEL) {
  }
  return state;
}

function defs(state = {}, action) {
  if (action.type === ACTION.DEFS_LOADED) {
    const defs = {...action.payload};
    // Add the id of the def to itself
    const vals = Object.keys(defs).reduce((acc,k) => {
      const v = defs[k];
      v.id = k;
      acc[k] = v;
      return acc;
    },{})
    return vals

  } else if (action.type === ACTION.DELETE_TABLE) {
    return Object.keys(state)
        .filter(k => k !== action.id)
        .reduce((acc, k) => {
          return {
            ...acc,
            [k]: state[k]
          };
        }, {});

  } else if (action.type === ACTION.UPDATE_DEFS) {
    return action.defs

  } else if (action.type === ACTION.UPDATE_DEF) {
    const defs = {...state}
    defs[action.def.name] = action.def
    return defs

  } else if (action.type === ACTION.DELETE_COLUMN) {
  } else if (action.type === ACTION.NEW_TABLE) {
    const d = {...state}
    d[action.name] = action.def;
    return d
  }
  return state;
}

function path(state = "/", action) {
  if (action.type === ACTION.CHANGE_PATH) {
    return action.path;
  }
  return state
}

const initialState = {
  db: new Firebase(),
};

export default function combination(state = initialState, action) {
  const vals = {
    ...state,
    //...combineReducers({ //WHY THE FUCK THIS DOESNT WORK!!!!!!
    ui: ui(state.ui, action),
    defs: defs(state.defs, action),
    cache: cache(state.cache, action),
    path: path(state.path, action),
  }
  return vals;
}

//export default rootReducer;
