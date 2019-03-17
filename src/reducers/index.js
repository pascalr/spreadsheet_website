import * as ACTION from "../constants/action-types";

import Firebase from '../Firebase'

const initialState = {
  editMode: false,
  db: new Firebase(),
  defs: {},
};

function rootReducer(state = initialState, action) {
  if (action.type === ACTION.TOGGLE_EDIT_MODE) {
    return Object.assign({}, state, {editMode:!state.editMode})
  } else if (action.type === ACTION.DEFS_LOADED) {
    return Object.assign({}, state, {defs:action.payload})
  } else if (action.type === ACTION.NEW_TABLE) {
    const d = {...state.defs}
    d[action.payload.name] = action.payload.def;
    return Object.assign({}, state, {defs: d})
  }
  return state;
}

export default rootReducer;
