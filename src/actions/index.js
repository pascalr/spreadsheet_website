import * as ACTION from "../constants/action-types"
import _ from 'lodash'

import Helper, {nextColumnName} from '../Helper'

import * as TABLES from '../constants/tables'

import uuidv1 from 'uuid/v1'

import { Map } from 'immutable'

export function toggleEditMode() {
  return { type: ACTION.TOGGLE_EDIT_MODE };
};

const EMPTY_DEF = {backgroundColor: "", showLineNumbers: true, layout: [[""]]}
export function newTable(db, defs) {
  const name = Helper.nextTableName(defs)
  const id = uuidv1();
  const idCol = uuidv1();
  const def = {...EMPTY_DEF, name, cols: {}}
  def.cols[idCol] = {name: "A", id: idCol}
  def.layout = [[idCol]]
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
  let cols = [...def.layout[0]]
  cols.splice(to, 0, ...cols.splice(from, 1))
  def.layout[0] = cols
  db.setRecord(TABLES.DEFS,def.id,def)
  return { type: ACTION.UPDATE_DEF, def };
};

function withColumn(theDef) {
  const def = {...theDef}
  const id = uuidv1();
  const oldCols = def.cols || {}
  const cols = {...oldCols, [id]: {name: nextColumnName(def), type: ""}}
  def.cols = cols
  def.layout[0] = [...def.layout[0], id]
  return def
}

export function addColumn(db, theDef) {
  const def = withColumn(theDef)
  db.setRecord(TABLES.DEFS,def.id,def)
  return { type: ACTION.UPDATE_DEF, def };
};

function withoutColumn(theDef, columnId) {
  const def = {...theDef}
  const cols = _.keys(def.cols)
    .filter(c => c !== columnId)
    .reduce((acc,k) => ({...acc, [k]: def.cols[k]}),{})
  def.cols = cols
  def.layout[0] = def.layout[0].filter(e => e !== columnId)
  return def
}

export function deleteColumn(db, theDef, columnId) {
  const def = withoutColumn(theDef, columnId)
  db.setRecord(TABLES.DEFS,def.id,def)
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

export function setDb(db, path, val) {
  db.setPath(path,val)
  if (path.constructor === Array) {
    return { type: ACTION.CACHE.SET, path: ["root", ...path], val };
  } else {
    return { type: ACTION.CACHE.SET, path: ["root", path], val };
  }
}

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
