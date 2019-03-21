import * as ACTION from "../constants/action-types";

import { combineReducers } from 'redux'

import { createBrowserHistory } from 'history';

import Firebase from '../Firebase'

import { Map } from 'immutable';

const uiInitialState = {
  editMode: false,
};

function ui(state = uiInitialState, action) {
  if (action.type === ACTION.TOGGLE_EDIT_MODE) {
    return Object.assign({}, state, {editMode:!state.editMode})
  }
  return state;
}

// The cache is the local version of the db.
// It is a generic way of accessing models.
function cache(state = {}, action) {
  if (action.type === ACTION.CACHE.SET) {
    console.log(`Cache: Set: path:${action.path}, val:${action.val}`);
    const path = action.path.constructor === Array ? action.path : [action.path]
    return Map(state).setIn(path, action.val).toJS()

  } else if (action.type === ACTION.CACHE.PUSH) {
  } else if (action.type === ACTION.CACHE.NEW) {
  } else if (action.type === ACTION.CACHE.LIST) {
  } else if (action.type === ACTION.CACHE.DEL) {
  }
  return state;
}

function defs(state = {root: {}}, action) {
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

function saveToDb(oldState, newState, action) {
  if (action.type === ACTION.CACHE.SET) {
    console.log('Saving cache to db.');
    const path = action.path.constructor === Array ? action.path.join('/') : action.path
    newState.db.set("cache/"+path, action.val)
  }
}

export default function combination(state, action) {
  if (state === undefined) {
    state = {
      db: new Firebase(),
      history: createBrowserHistory(),
    };
  }
  const vals = {
    ...state,
    //...combineReducers({ //WHY THE FUCK THIS DOESNT WORK!!!!!!
    ui: ui(state.ui, action),
    defs: defs(state.defs, action),
    cache: cache(state.cache, action),
  }
  // FIXME: This function has side effect and should not belong in a reducer.
  //saveToDb(state,vals, action);
  return vals;
}

//export default rootReducer;
