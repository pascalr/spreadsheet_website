import * as ACTION from "../constants/action-types";

const initialState = {
  editMode: false
};

function rootReducer(state = initialState, action) {
  if (action.type === ACTION.TOGGLE_EDIT_MODE) {
    return Object.assign({}, state, {editMode:!state.editMode})
  }
  return state;
}

export default rootReducer;
