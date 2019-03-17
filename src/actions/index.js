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
  return { type: ACTION.NEW_TABLE, name, def: EMPTY_DEF};
};

export function defsLoaded(payload) {
  return { type: ACTION.DEFS_LOADED, payload };
};

export function columnDropped(payload) {
  return { type: ACTION.COLUMN_DROPPED, payload };
};

export function addColumn(payload) {
  return { type: ACTION.ADD_COLUMN, payload };
};

export function deleteColumn(payload) {
  return { type: ACTION.DELETE_COLUMN, payload };
};

export function deleteTable(payload) {
  return { type: ACTION.DELETE_TABLE, payload };
};
