import * as ACTION from "../constants/action-types"

import Helper, {nextColumnName} from '../Helper'

import * as TABLES from '../constants/tables'

import uuidv1 from 'uuid/v1'

export function toggleEditMode() {
  return { type: ACTION.TOGGLE_EDIT_MODE };
};

const EMPTY_DEF = {backgroundColor: "", showLineNumbers: true}
export function newTable(db, defs) {
  const name = Helper.nextTableName(defs)
  const id = uuidv1();
  const idCol = uuidv1();
  const def = {...EMPTY_DEF, name, cols: {name: "A", id: idCol}}
  db.setRecord(TABLES.DEFS,id,def)
  return { type: ACTION.NEW_TABLE, name: id, def };
};

export function defsLoaded(defs) {
  console.log('Loading defs')
  return { type: ACTION.DEFS_LOADED, payload: defs };
  //return { type: ACTION.CACHE.SET, path: TABLES.DEFS, defs };
};

export function columnDropped(db, theDef, from, to) {
  let def = {...theDef}
  let cols = [...Object.keys(def.cols)]
  cols.splice(to, 0, ...cols.splice(from, 1))
  def.cols = cols.reduce((acc,k) => ({...acc, k: def.cols[k]}),{})
  //db.setRecord(TABLES.DEFS,def.id,def)
  return { type: ACTION.UPDATE_DEF, def };
};

export function addColumn(db, theDef) {
  const def = {...theDef}
  const id = uuidv1();
  const oldCols = def.cols || {}
  const cols = {...{oldCols}, id: {name: nextColumnName(def), type: ""}}
  def.cols = cols
  //db.setRecord(TABLES.DEFS,def.id,def)
  return { type: ACTION.UPDATE_DEF, def };
};

export function deleteColumn(db, theDef, columnName) {
  const def = {...theDef}
  const cols = Object.keys(def.cols)
    .filter(c => def.cols[c].name !== columnName)
    .reduce((acc,k) => ({k: def.cols[k]}),{})
  def.cols = cols
  //db.setRecord(TABLES.DEFS,def.id,def)
  return { type: ACTION.UPDATE_DEF, def };
};

export function deleteTable(db, id) {
  db.deleteRecord(TABLES.DEFS,id)
  db.deleteRecord(TABLES.TABLES,id)
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
