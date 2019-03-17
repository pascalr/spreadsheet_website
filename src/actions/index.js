import * as ACTION from "../constants/action-types"

import Helper from '../Helper'

import * as TABLES from '../constants/tables'

export function toggleEditMode() {
  return { type: ACTION.TOGGLE_EDIT_MODE };
};

const EMPTY_DEF = {backgroundColor: "", columns: {},showLineNumbers: true}
export function newTable(db, defs) {
  const name = Helper.nextTableName(defs)
  db.set(TABLES.DEFS,defs)
  return { type: ACTION.NEW_TABLE, payload: {name: name, def: EMPTY_DEF} };
};

export function defsLoaded(payload) {
  return { type: ACTION.DEFS_LOADED, payload };
};
