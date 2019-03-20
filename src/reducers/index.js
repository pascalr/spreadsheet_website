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

  } else if (action.type === ACTION.COLUMN_DROPPED) {
  } else if (action.type === ACTION.DELETE_TABLE) {
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

const initialState = {
  db: new Firebase(),
};

export default function combination(state = initialState, action) {
  const vals = {
    ...state,
    //...combineReducers({ //WHY THE FUCK THIS DOESNT WORK!!!!!!
    ui: ui(state.ui, action),
    defs: defs(state.defs, action),
  }
  return vals;
}

//export default rootReducer;
