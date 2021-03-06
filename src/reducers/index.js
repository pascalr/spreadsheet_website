import * as ACTION from "../constants/action-types";
//import { combineReducers } from 'redux'
import { createBrowserHistory } from 'history'
//import Firebase from '../Firebase'
import SimpleDb from '../SimpleDb'
import { Map } from 'immutable';
import _ from 'lodash'

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
function cache(state = {root: {}}, action) {
  if (action.type === ACTION.CACHE.SET) {
    console.log(`Cache: Set: path:${action.path}`);
    const path = action.path.constructor === Array ? action.path : [action.path]
    return Map(state).setIn(path, action.val).toJS()

  } else if (action.type === ACTION.CACHE.PUSH) {
  } else if (action.type === ACTION.CACHE.NEW) {
  } else if (action.type === ACTION.CACHE.LIST) {
  } else if (action.type === ACTION.CACHE.DEL) {
  }
  return state;
}

function addIds(obj) {
  return _.keys(obj).reduce((acc,k) => {
    const v = obj[k];
    v.id = k;
    acc[k] = v;
    return acc;
  },{})
}

function defs(state = {}, action) {
  if (action.type === ACTION.DEFS_LOADED) {
    const defs = addIds(action.payload)
    return _.keys(action.payload).reduce((acc,k) => {
      if (defs[k].del) {return acc;} // If the def is marked as delete dont return it.
      acc[k] = {...defs[k], cols: addIds(defs[k].cols)}
      return acc;
    }, {})

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

export default function combination(state, action) {
  if (state === undefined) {
    state = {
      db: new SimpleDb(),
      //db: new Firebase(),
      history: createBrowserHistory(),
    };
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      window.db = state.db;
    }
  }
  const vals = {
    ...state,
    //...combineReducers({ //WHY THE FUCK THIS DOESNT WORK!!!!!!
    ui: ui(state.ui, action),
    defs: defs(state.defs, action),
    cache: cache(state.cache, action),
  }
  return vals;
}

//export default rootReducer;
