import * as ACTION from "../constants/action-types"
import _ from 'lodash'

import Helper, {nextColumnName} from '../Helper'

import * as TABLE from '../constants/tables'

import uuidv1 from 'uuid/v1'

export function toggleEditMode() {
  return { type: ACTION.TOGGLE_EDIT_MODE };
};

const EMPTY_DEF = {backgroundColor: "", showLineNumbers: true, layout: [[""]]}
export function newTable(db, defs, theName,theId) {
  const name = theName || Helper.nextTableName(defs)
  const id = theId || uuidv1();
  const idCol = uuidv1();
  const def = {...EMPTY_DEF, name, cols: {}}
  def.cols[idCol] = {name: "A", id: idCol}
  def.layout = [[idCol]]
  db.setRecord(TABLE.DEFS,id,def)
  return { type: ACTION.NEW_TABLE, name: id, def };
};

export function defsLoaded(defs) {
  console.log('Loading defs')
  return { type: ACTION.DEFS_LOADED, payload: defs };
  //return { type: ACTION.CACHE.SET, path: TABLE.DEFS, defs };
};

export function columnDropped(db, theDef, from, to) {
  let def = {...theDef}
  let cols = [...def.layout[0]]
  cols.splice(to, 0, ...cols.splice(from, 1))
  def.layout[0] = cols
  db.setRecord(TABLE.DEFS,def.id,def)
  return { type: ACTION.UPDATE_DEF, def };
};

function withColumn(theDef,layoutNb) {
  const def = {...theDef}
  const id = uuidv1();
  const oldCols = def.cols || {}
  const cols = {...oldCols, [id]: {name: nextColumnName(def), type: ""}}
  def.cols = cols
  def.layout[layoutNb] = [...def.layout[layoutNb], id]
  return def
}

export function addColumn(db, theDef, layoutNb) {
  const def = withColumn(theDef, layoutNb)
  db.setRecord(TABLE.DEFS,def.id,def)
  return { type: ACTION.UPDATE_DEF, def };
};

export function addColumnUnder(db, theDef) {
  const def = {...theDef}
  const id = uuidv1();
  const oldCols = def.cols || {}
  const cols = {...oldCols, [id]: {name: nextColumnName(def), type: ""}}
  def.cols = cols
  def.layout[def.layout.length] = [id]
  db.setRecord(TABLE.DEFS,def.id,def)
  return { type: ACTION.UPDATE_DEF, def };
}

function withoutColumn(theDef, columnId, layoutNb) {
  const def = {...theDef}
  const cols = _.keys(def.cols)
    .filter(c => c !== columnId)
    .reduce((acc,k) => ({...acc, [k]: def.cols[k]}),{})
  def.cols = cols
  def.layout[layoutNb] = def.layout[layoutNb].filter(e => e !== columnId)
  return def
}

export function deletePath(db, path) {
  db.delete(path)
  return { type: ACTION.CACHE.SET, path: ["root", ..._.castArray(path)], val: null };
}

export function deleteColumn(db, theDef, columnId, layoutNb) {
  const def = withoutColumn(theDef, columnId, layoutNb)
  db.setRecord(TABLE.DEFS,def.id,def)
  return { type: ACTION.UPDATE_DEF, def };
};

/*export function deleteTable(db, id) {
  db.deleteRecord(TABLE.DEFS,id)
  db.deleteRecord(TABLE.TABLES,id)
  return { type: ACTION.DELETE_TABLE, id };
};*/

export function modelLoaded(path, val) {
  return { type: ACTION.CACHE.SET, path, val };
};

export function addTableToScreen(screen, name) {
  const val = {...screen.tables, [name]: true}
  return { type: ACTION.CACHE.SET, path: ['screen', "tables"], val }
};

export function updateDb(db,path,vals) {
  db.update(path, vals)
  return { type: ACTION.CACHE.SET, path: ["root", ..._.castArray(path)], vals };
}

export function setDb(db, path, val) {
  db.setPath(path,val)
  // TODO: Try this replacement
  //return { type: ACTION.CACHE.SET, path: ["root", ..._.castArray(path)], val };
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

export function addPreview(db, tableId) {
  const id = uuidv1();
  const p = {id, width: 50, height: 50, x: 0, y:0, tableId}
  return setDb(db, [TABLE.PREVIEW, id], p)
}

export function push(path, val) {
  if (path.constructor === Array) {
    return { type: ACTION.CACHE.PUSH, path: ["root", ...path], val };
  } else {
    return { type: ACTION.CACHE.PUSH, path: ["root", path], val };
  }
}
