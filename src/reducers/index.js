import * as ACTION from "../constants/action-types";

import Firebase from '../Firebase'

const initialState = {
  editMode: false,
  //  firebase: new Firebase(),
};

function rootReducer(state = initialState, action) {
  if (action.type === ACTION.TOGGLE_EDIT_MODE) {
    return Object.assign({}, state, {editMode:!state.editMode})
  }
  return state;
}

export default rootReducer;
