import * as ACTION from "../constants/action-types"

import Helper, {nextColumnName} from '../Helper'

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

export function defsLoaded(defs) {
  console.log('Loading defs')
  return { type: ACTION.DEFS_LOADED, payload: defs };
  //return { type: ACTION.CACHE.SET, path: TABLES.DEFS, defs };
};

export function columnDropped(db, theDef, from, to) {
  let def = {...theDef}
  let columns = [...def.columns]
  columns.splice(to, 0, ...columns.splice(from, 1))
  def.columns = columns
  db.setRecord(TABLES.DEFS,def.id,def)
  return { type: ACTION.UPDATE_DEF, def };
};

export function addColumn(db, theDef) {
  const def = {...theDef}
  const columns = [...def.columns, {name: nextColumnName(def), type: ""}]
  def.columns = columns
  db.setRecord(TABLES.DEFS,def.id,def)
  return { type: ACTION.UPDATE_DEF, def };
};

export function deleteColumn(db, theDef, columnName) {
  const def = {...theDef}
  const columns = [...def.columns].filter(e => e.name !== columnName)
  def.columns = columns
  db.setRecord(TABLES.DEFS,def.id,def)
  return { type: ACTION.UPDATE_DEF, def };
};

export function deleteTable(db, id) {
  return { type: ACTION.DELETE_TABLE, id };
};

export function modelLoaded(path, val) {
  return { type: ACTION.CACHE.SET, path, val };
};

export function addTableToScreen(screen, name) {
  const val = {...screen.tables, [name]: true}
  return { type: ACTION.CACHE.SET, path: [TABLES.SCREEN, "tables"], val }
};

export function set(path, val) {
  if (path.constructor === Array) {
    return { type: ACTION.CACHE.SET, path: ["root", ...path], val };
  } else {
    return { type: ACTION.CACHE.SET, path: ["root", path], val };
  }
}

export function push(path, val) {
  if (path.constructor === Array) {
    return { type: ACTION.CACHE.PUSH, path: ["root", ...path], val };
  } else {
    return { type: ACTION.CACHE.PUSH, path: ["root", path], val };
  }
}
