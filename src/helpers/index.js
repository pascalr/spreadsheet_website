import Helper from '../Helper'
import uuidv1 from 'uuid/v1'

const EMPTY_DEF = {layout: [[""]]}
export function genDef(defs, theName,theId) {
  const name = theName || Helper.nextTableName(defs)
  const id = theId || uuidv1();
  const idCol = uuidv1();
  const def = {...EMPTY_DEF, name, cols: {}}
  def.cols[idCol] = {name: "A", id: idCol}
  def.layout = [[idCol]]
  return {id, attrs: def}
}
